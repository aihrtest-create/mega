import { Router } from 'express';
import { amo } from '../services/amo.js';
import { buildConfiguratorUrl } from '../config/amo-config.js';

const router = Router();

/**
 * POST /api/amo/start-config
 * Called by AmoCRM SalesBot when a lead enters «Отправить конфигуратор» stage.
 *
 * Body (sent by SalesBot, configurable):
 *   { "lead_id": 33153603 }
 *   (или с произвольной обёрткой — мы достаём lead_id из любого места)
 *
 * Response:
 *   { "url": "https://aihrtest-create.github.io/planner-park/?lead=33153603",
 *     "name": "Олеся" }
 *
 * SalesBot подставит {{json.url}} и {{json.name}} в следующее сообщение.
 */
router.post('/start-config', async (req, res) => {
  try {
    const leadId = extractLeadId(req.body);
    if (!leadId) {
      return res.status(400).json({ error: 'lead_id отсутствует в теле запроса' });
    }

    // Verify the lead exists in AmoCRM and pull its name (для подстановки в сообщение)
    let name = null;
    try {
      const lead = await amo.getLead(leadId);
      name = lead?.name || null;
    } catch (e) {
      console.warn(`[AMO] Не удалось получить имя лида ${leadId}: ${e.message}`);
      // Не блокируем выдачу URL из-за этой ошибки
    }

    const url = buildConfiguratorUrl(leadId);
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
