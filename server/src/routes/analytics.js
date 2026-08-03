import { Router } from 'express';
import { db, statements } from '../database.js';
import { isAmoLeadId, signLeadId } from '../config/amo-config.js';

const router = Router();

/**
 * Middleware для валидации подписи ссылки
 */
function validateLeadSignature(req, res, next) {
  const leadId = req.params.id || req.body?.lead_id;
  if (!leadId) return next();
  if (!isAmoLeadId(leadId)) return next();

  const sig = req.query.sig || req.body?.sig;
  const expectedSig = signLeadId(leadId);

  req.isValidSignature = (sig === expectedSig);
  next();
}

/**
 * POST /api/analytics/step
 * Отправка события просмотра шага конфигуратора
 * Body: { lead_id, step_id, step_index, step_name }
 */
router.post('/step', validateLeadSignature, (req, res) => {
  try {
    const { lead_id, step_id, step_index, step_name } = req.body;

    if (!lead_id || !step_id) {
      return res.status(400).json({ error: 'lead_id и step_id обязательны' });
    }

    const eventPayload = JSON.stringify({
      step_id,
      step_index: step_index ?? 0,
      step_name: step_name || step_id
    });

    statements.addEvent.run(String(lead_id), 'step_view', eventPayload);

    return res.json({ success: true });
  } catch (error) {
    console.error('[ANALYTICS STEP ERROR]', error);
    return res.status(500).json({ error: 'Ошибка сохранения аналитики' });
  }
});

/**
 * GET /api/analytics/funnel
 * Получить аггрегированные данные воронки и проценты отвала по шагам
 */
router.get('/funnel', (req, res) => {
  try {
    // 1. Агрегация по глобальным этапам
    const eventsSummaryRows = statements.getEventsCountByType.all();
    const eventCounts = {
      link_generated: 0,
      config_opened: 0,
      config_submitted: 0,
    };

    eventsSummaryRows.forEach(row => {
      if (eventCounts[row.event_type] !== undefined) {
        eventCounts[row.event_type] = row.unique_leads || 0;
      }
    });

    // Также добираем статистику из таблицы leads
    const leadStats = statements.getStats.all();
    let totalLeadsFromTable = 0;
    let submittedFromTable = 0;
    leadStats.forEach(s => {
      totalLeadsFromTable += s.count;
      if (s.status === 'submitted' || s.status === 'contacted' || s.status === 'confirmed') {
        submittedFromTable += s.count;
      }
    });

    // Финальные цифры основных вех
    const linksGenerated = Math.max(eventCounts.link_generated, totalLeadsFromTable);
    const configOpened = Math.max(eventCounts.config_opened, 1);
    const configSubmitted = Math.max(eventCounts.config_submitted, submittedFromTable);

    // 2. Детальная статистика по шагам (Step Views)
    const rawStepEvents = db.prepare(`
      SELECT event_data, lead_id, created_at
      FROM lead_events
      WHERE event_type = 'step_view'
      ORDER BY id ASC
    `).all();

    const stepStatsMap = {}; // { step_id: { step_name, step_index, unique_leads: Set } }

    rawStepEvents.forEach(e => {
      if (!e.event_data) return;
      try {
        const data = JSON.parse(e.event_data);
        const stepId = data.step_id || 'unknown';
        if (!stepStatsMap[stepId]) {
          stepStatsMap[stepId] = {
            step_id: stepId,
            step_name: data.step_name || stepId,
            step_index: data.step_index || 0,
            leadsSet: new Set()
          };
        }
        stepStatsMap[stepId].leadsSet.add(e.lead_id);
      } catch (err) {
        // Игнорируем невалидный JSON
      }
    });

    // Сортируем шаги по порядку прохождения (step_index)
    const stepList = Object.values(stepStatsMap)
      .map(s => ({
        step_id: s.step_id,
        step_name: s.step_name,
        step_index: s.step_index,
        unique_leads_count: s.leadsSet.size
      }))
      .sort((a, b) => a.step_index - b.step_index);

    // Расчёт Drop-off Rate (% потерь) для каждого шага относительно предыдущего
    let prevCount = configOpened > 0 ? configOpened : (stepList[0]?.unique_leads_count || 1);

    const stepsWithDropOff = stepList.map((step, idx) => {
      const currentCount = step.unique_leads_count;
      const dropOffCount = Math.max(0, prevCount - currentCount);
      const dropOffRate = prevCount > 0 ? ((dropOffCount / prevCount) * 100).toFixed(1) : '0.0';
      const conversionRate = prevCount > 0 ? ((currentCount / prevCount) * 100).toFixed(1) : '100.0';
      
      prevCount = currentCount;

      return {
        ...step,
        drop_off_count: dropOffCount,
        drop_off_rate_percent: Number(dropOffRate),
        step_conversion_percent: Number(conversionRate)
      };
    });

    return res.json({
      summary: {
        links_generated: linksGenerated,
        config_opened: configOpened,
        config_submitted: configSubmitted,
        overall_conversion_percent: linksGenerated > 0 
          ? ((configSubmitted / linksGenerated) * 100).toFixed(1) 
          : '0.0',
        opened_conversion_percent: linksGenerated > 0 
          ? ((configOpened / linksGenerated) * 100).toFixed(1) 
          : '0.0',
        submit_conversion_from_opened_percent: configOpened > 0 
          ? ((configSubmitted / configOpened) * 100).toFixed(1) 
          : '0.0'
      },
      steps: stepsWithDropOff
    });
  } catch (error) {
    console.error('[ANALYTICS FUNNEL ERROR]', error);
    return res.status(500).json({ error: 'Ошибка формирования аналитики воронки' });
  }
});

export default router;
