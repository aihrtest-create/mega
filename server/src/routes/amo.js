import { Router } from 'express';
import { amo } from '../services/amo.js';
import { buildConfiguratorUrl, signLeadId, CONFIGURATOR_URL } from '../config/amo-config.js';
import { redis } from '../services/redis.js';
import { nanoid } from 'nanoid';
import { statements } from '../database.js';

const router = Router();

/**
 * POST /api/amo/start-config
 * Called by AmoCRM SalesBot when a lead enters «Отправить конфигуратор» stage.
 */
router.post('/start-config', async (req, res) => {
  try {
    const leadId = extractLeadId(req.body);
    if (!leadId) {
      return res.status(400).json({ error: 'lead_id отсутствует в теле запроса' });
    }

    // Verify the lead exists in AmoCRM and pull its name
    let name = null;
    try {
      const lead = await amo.getLead(leadId);
      name = lead?.name || null;
    } catch (e) {
      console.warn(`[AMO] Не удалось получить имя лида ${leadId}: ${e.message}`);
    }

    const originalUrl = buildConfiguratorUrl(leadId);

    let url = originalUrl;
    try {
      const sig = signLeadId(leadId);
      const inviteData = JSON.stringify({ leadId, sig, originalUrl });
      for (let attempt = 0; attempt < 3; attempt++) {
        const id = nanoid(6);
        const stored = await redis.set(`invite:${id}`, inviteData, 'EX', 5184000, 'NX');
        if (stored === 'OK') {
          const base = CONFIGURATOR_URL.replace(/\/+$/, '');
          url = `${base}/?id=${id}`;
          break;
        }
      }
    } catch (e) {
      console.warn(`[AMO] Redis недоступен, отдаём длинную ссылку: ${e.message}`);
    }

    // Создаём/гарантируем наличие лида в локальной базе leads
    try {
      const existing = statements.getLead.get(String(leadId));
      if (!existing) {
        statements.createLead.run(String(leadId), name || `AmoCRM Лид #${leadId}`, '', 'telegram');
      }
      statements.markLinkSent.run(String(leadId));
    } catch (e) {
      console.warn(`[AMO] Ошибка гарантии лида в БД: ${e.message}`);
    }

    // Записываем событие аналитики
    try {
      statements.addEvent.run(String(leadId), 'link_generated', JSON.stringify({ url }));
    } catch (e) {
      console.warn(`[ANALYTICS] Ошибка записи link_generated: ${e.message}`);
    }

    try {
      await amo.addNoteToLead(leadId, `🔗 Персональная ссылка на конфигуратор: ${url}`);
    } catch (e) {
      console.warn(`[AMO] Не удалось добавить примечание со ссылкой: ${e.message}`);
    }

    console.log(`[AMO] start-config: lead_id=${leadId} → ${url}`);
    return res.json({ url, name, lead_id: leadId });
  } catch (e) {
    console.error('[AMO start-config ERROR]', e);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

function extractLeadId(body) {
  if (!body || typeof body !== 'object') return null;
  const candidates = [
    body.lead_id,
    body.leadId,
    body.id,
    body?.leads?.add?.[0]?.id,
    body?.leads?.status?.[0]?.id,
    body?.leads?.update?.[0]?.id,
    body?.lead?.id,
  ];
  for (const v of candidates) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (/^\d+$/.test(s)) return s;
  }
  return null;
}

export default router;
