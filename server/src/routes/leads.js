import { Router } from 'express';
import { nanoid } from 'nanoid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { statements } from '../database.js';
import { sendMessage as sendTelegramMessage, sendAttachment as sendTelegramAttachment } from '../bots/telegram.js';
import { sendMessage as sendMaxMessage, sendAttachment as sendMaxAttachment } from '../bots/max.js';
import { amo } from '../services/amo.js';
import { isAmoLeadId, AMO_FIELDS, signLeadId } from '../config/amo-config.js';
import { buildAmoNoteText, buildAmoFieldUpdates } from '../services/amo-format.js';

function validateLeadSignature(req, res, next) {
  const leadId = req.params.id;
  if (!isAmoLeadId(leadId)) {
    return next();
  }
  const sig = req.query.sig || req.body?.sig;
  const expectedSig = signLeadId(leadId);
  if (!sig || sig !== expectedSig) {
    console.warn(`[SECURITY] Unauthorized access attempt to lead ${leadId} (sig: ${sig || 'missing'}, expected: ${expectedSig})`);
    return res.status(403).json({ error: 'Access denied: invalid URL signature' });
  }
  next();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${nanoid(6)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

const router = Router();

/**
 * POST /api/leads/:id/message — Отправить сообщение клиенту вручную
 */
router.post('/:id/message', async (req, res) => {
  try {
    const lead = statements.getLead.get(req.params.id);
    const { text } = req.body;

    if (!lead || !lead.chat_id) {
      return res.status(404).json({ error: 'Клиент не подключен к боту' });
    }

    let success = false;
    if (lead.messenger === 'max') {
      success = await sendMaxMessage(lead.chat_id, text);
    } else {
      success = await sendTelegramMessage(lead.chat_id, text);
    }
    
    if (success) {
      statements.addEvent.run(lead.id, 'manager_message', text);
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Ошибка отправки через бота' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

/**
 * POST /api/leads/:id/attachment — Отправить файл клиенту
 */
router.post('/:id/attachment', upload.single('file'), async (req, res) => {
  try {
    const lead = statements.getLead.get(req.params.id);
    if (!lead || !lead.chat_id) {
      return res.status(404).json({ error: 'Клиент не подключен к боту' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не прикреплён' });
    }

    const filePath = req.file.path;
    const caption = req.body.caption || '';
    const mime = req.file.mimetype;

    let success = false;
    if (lead.messenger === 'max') {
      success = await sendMaxAttachment(lead.chat_id, filePath, mime, caption);
    } else {
      success = await sendTelegramAttachment(lead.chat_id, filePath, mime, caption);
    }

    if (success) {
      const fileInfo = JSON.stringify({ filename: req.file.originalname, mime, caption });
      statements.addEvent.run(lead.id, 'manager_attachment', fileInfo);
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Ошибка отправки файла' });
    }
  } catch (error) {
    console.error('[ATTACHMENT ERROR]', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

/**
 * POST /api/leads — Создать нового лида (с лендинга)
 * Body: { name, phone, messenger: 'telegram' | 'max' }
 */
router.post('/', (req, res) => {
  try {
    const { name, phone, messenger } = req.body;

    if (!name || !phone || !messenger) {
      return res.status(400).json({ error: 'Необходимы поля: name, phone, messenger' });
    }

    if (!['telegram', 'max'].includes(messenger)) {
      return res.status(400).json({ error: 'messenger должен быть telegram или max' });
    }

    const id = nanoid(12);
    statements.createLead.run(id, name.trim(), phone.trim(), messenger);
    statements.addEvent.run(id, 'lead_created', JSON.stringify({ name, phone, messenger }));

    const lead = statements.getLead.get(id);

    console.log(`[LEAD] Новый лид: ${name} (${phone}) → ${messenger} [${id}]`);

    res.status(201).json({
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        messenger: lead.messenger,
      },
    });
  } catch (error) {
    console.error('[LEAD ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/leads/:id — Получить информацию о лиде
 * Если id числовой и в локальной БД не найден — пробуем достать из AmoCRM.
 */
router.get('/:id', validateLeadSignature, async (req, res) => {
  try {
    const lead = statements.getLead.get(req.params.id);
    if (lead) return res.json({ success: true, lead });

    if (isAmoLeadId(req.params.id)) {
      const amoLead = await amo.getLead(req.params.id);
      const contactId = amoLead?._embedded?.contacts?.[0]?.id;
      let phone = '';
      let contactName = '';
      if (contactId) {
        const contact = await amo.getContact(contactId);
        contactName = contact?.name || '';
        const phoneField = contact?.custom_fields_values?.find((f) => f.field_code === 'PHONE');
        phone = phoneField?.values?.[0]?.value || '';
      }
      return res.json({
        success: true,
        lead: {
          id: req.params.id,
          name: contactName || amoLead?.name || '',
          phone,
          source: 'amo',
        },
      });
    }

    return res.status(404).json({ error: 'Лид не найден' });
  } catch (error) {
    console.error('[LEAD GET ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * POST /api/leads/:id/opened — Отметить что клиент открыл конфигуратор
 * Для Amo-лидов добавляем примечание в карточку, чтобы менеджер видел факт открытия.
 */
router.post('/:id/opened', validateLeadSignature, async (req, res) => {
  try {
    const lead = statements.getLead.get(req.params.id);
    if (lead) {
      if (['link_sent', 'bot_connected'].includes(lead.status)) {
        statements.markConfigOpened.run(req.params.id);
        statements.addEvent.run(req.params.id, 'config_opened', null);
        console.log(`[LEAD] Конфигуратор открыт: ${lead.name} [${lead.id}]`);
      }
      return res.json({ success: true, lead: statements.getLead.get(req.params.id) });
    }

    if (isAmoLeadId(req.params.id)) {
      try {
        await amo.addNoteToLead(req.params.id, '👀 Клиент открыл конфигуратор');
        console.log(`[AMO] Лид ${req.params.id}: открыл конфигуратор → примечание добавлено`);
      } catch (e) {
        console.warn(`[AMO] Не удалось добавить примечание об открытии: ${e.message}`);
      }
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Лид не найден' });
  } catch (error) {
    console.error('[LEAD OPENED ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * POST /api/leads/:id/configure — Отправить конфигурацию праздника
 * Body: { конфигурация из визарда }
 *
 * Для Amo-лидов (числовой id) пишем примечание + обновляем кастомные поля и цену.
 * Для локальных лидов сохраняем в SQLite как раньше.
 */
router.post('/:id/configure', validateLeadSignature, async (req, res) => {
  try {
    const lead = statements.getLead.get(req.params.id);
    if (lead) {
      const configData = JSON.stringify(req.body);
      statements.saveConfiguration.run(configData, req.params.id);
      statements.addEvent.run(req.params.id, 'config_submitted', configData);
      console.log(`[LEAD] Конфигурация получена: ${lead.name} [${lead.id}]`);
      return res.json({
        success: true,
        message: 'Конфигурация сохранена',
        lead: statements.getLead.get(req.params.id),
      });
    }

    if (isAmoLeadId(req.params.id)) {
      const amoLeadId = req.params.id;
      const noteText = buildAmoNoteText(req.body);
      const fieldUpdates = buildAmoFieldUpdates(req.body, amoLeadId);

      // Add note (всегда — это самое важное)
      try {
        await amo.addNoteToLead(amoLeadId, noteText);
        console.log(`[AMO] Лид ${amoLeadId}: примечание добавлено`);
      } catch (e) {
        console.error(`[AMO] Не удалось добавить примечание: ${e.message}`);
      }

      // Update fields + price (best-effort, не падаем если что-то пошло не так)
      try {
        await amo.updateLead(amoLeadId, fieldUpdates);
        console.log(`[AMO] Лид ${amoLeadId}: поля обновлены`);
      } catch (e) {
        console.error(`[AMO] Не удалось обновить поля: ${e.message}`);
        if (e.body) console.error('   ответ:', JSON.stringify(e.body, null, 2));
      }

      return res.json({ success: true, message: 'Конфигурация отправлена в AmoCRM' });
    }

    return res.status(404).json({ error: 'Лид не найден' });
  } catch (error) {
    console.error('[LEAD CONFIGURE ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/leads — Получить все лиды (для менеджерской панели)
 */
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    const leads = status
      ? statements.getLeadsByStatus.all(status)
      : statements.getAllLeads.all();

    const stats = statements.getStats.all();

    res.json({ success: true, leads, stats });
  } catch (error) {
    console.error('[LEAD ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PATCH /api/leads/:id/status — Обновить статус лида (менеджером)
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'bot_connected', 'link_sent', 'configuring', 'submitted', 'contacted', 'confirmed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Недопустимый статус. Допустимые: ${validStatuses.join(', ')}` });
    }

    statements.updateLeadStatus.run(status, req.params.id);
    if (status === 'contacted') {
      statements.markContacted.run(req.params.id);
    }
    statements.addEvent.run(req.params.id, 'status_changed', JSON.stringify({ status }));

    res.json({ success: true, lead: statements.getLead.get(req.params.id) });
  } catch (error) {
    console.error('[LEAD ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PATCH /api/leads/:id/notes — Обновить заметки менеджера
 */
router.patch('/:id/notes', (req, res) => {
  try {
    const { notes } = req.body;
    statements.updateNotes.run(notes || '', req.params.id);
    statements.addEvent.run(req.params.id, 'notes_updated', null);

    res.json({ success: true, lead: statements.getLead.get(req.params.id) });
  } catch (error) {
    console.error('[LEAD ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/leads/:id/events — Получить историю событий лида
 */
router.get('/:id/events', (req, res) => {
  try {
    const events = statements.getLeadEvents.all(req.params.id);
    res.json({ success: true, events });
  } catch (error) {
    console.error('[LEAD ERROR]', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
