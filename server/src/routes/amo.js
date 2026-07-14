import { Router } from 'express';
import { amo } from '../services/amo.js';
import { buildConfiguratorUrl, signLeadId, CONFIGURATOR_URL } from '../config/amo-config.js';
import { redis } from '../services/redis.js';
import { nanoid } from 'nanoid';

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

    const originalUrl = buildConfiguratorUrl(leadId);

    // Короткая ссылка: параметры лежат в Redis 60 дней.
    // Если Redis недоступен — отдаём длинную ссылку, SalesBot должен получить URL в любом случае.
    let url = originalUrl;
    try {
      const sig = signLeadId(leadId);
      const inviteData = JSON.stringify({ leadId, sig, originalUrl });
      // NX не даёт перезаписать чужой ключ при коллизии nanoid — пробуем заново
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

    // Кладём ссылку примечанием в карточку: SalesBot-вебхук не умеет читать наш ответ,
    // поэтому менеджер забирает персональную ссылку из ленты лида
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
