import TelegramBot from 'node-telegram-bot-api';
import { statements } from '../database.js';

let bot = null;

const CONFIGURATOR_URL = process.env.CONFIGURATOR_URL || 'https://party.hello-park.io/mega/';

/**
 * Генерирует текст приветственного сообщения (выглядит как от реального человека)
 */
function getWelcomeMessage(name) {
  const greetings = [
    `Здравствуйте, ${name}! 😊\n\nМеня зовут Анна, я банкетный менеджер Hello Park. Спасибо за вашу заявку на проведение дня рождения!\n\nЯ подготовила для вас персональный конфигуратор праздника — с его помощью вы сможете выбрать формат, квесты, шоу-программы, меню и все остальные детали.\n\nНажмите на кнопку ниже, чтобы начать 👇`,
    `Добрый день, ${name}! 🎉\n\nЭто Анна из Hello Park. Рада, что вы выбрали нас для проведения праздника!\n\nСпециально для вас подготовлен конфигуратор — вы сможете собрать идеальный день рождения, выбрав все опции по вкусу.\n\nНажмите кнопку ниже, чтобы начать оформление 👇`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Инициализация Telegram бота
 */
export function initTelegramBot() {
  const token = process.env.TG_BOT_TOKEN;
  if (!token || token === 'your_telegram_bot_token_here') {
    console.log('[TG BOT] ⚠️  Telegram токен не настроен. Бот не запущен.');
    return null;
  }

  // Telegram servers frequently fail to reach Russian VPS via Webhook (Connection timed out).
  // So we explicitly force Long Polling for Telegram.
  const useWebhook = false; 

  if (useWebhook) {
    bot = new TelegramBot(token);
    const webhookUrl = `${serverUrl}/webhook/telegram`;
    bot.setWebHook(webhookUrl).then(() => {
      console.log(`[TG BOT] ✅ Webhook установлен: ${webhookUrl}`);
    }).catch(err => {
      console.error('[TG BOT] ❌ Ошибка установки webhook:', err.message);
    });
  } else {
    // Delete webhook if it was previously set, to avoid conflicts with polling
    bot = new TelegramBot(token, { polling: true });
    bot.deleteWebHook().catch(() => {});
    console.log('[TG BOT] ✅ Запущен в режиме Long Polling');
  }

  // Handle /start command with lead ID payload
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const payload = match[1]; // lead ID from deeplink

    if (!payload) {
      // Пользователь нажал /start без параметров
      await bot.sendMessage(chatId, 
        'Здравствуйте! 👋\n\nЯ — ассистент Hello Park. Чтобы начать оформление праздника, оставьте заявку на нашем сайте, и я пришлю вам персональный конфигуратор!',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🌐 Перейти на сайт', url: CONFIGURATOR_URL }
            ]]
          }
        }
      );
      return;
    }

    // Payload содержит ID лида
    const leadId = payload.replace('lead_', '');
    const lead = statements.getLead.get(leadId);

    if (!lead) {
      await bot.sendMessage(chatId, 
        '⚠️ Ваша заявка не найдена или срок ссылки истек. Пожалуйста, оставьте новую заявку на сайте!',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🌐 Перейти на сайт', url: CONFIGURATOR_URL }
            ]]
          }
        }
      );
      return;
    }

    // Связываем бота с лидом
    statements.connectBot.run(String(chatId), msg.from.username || '', leadId);
    statements.addEvent.run(leadId, 'telegram_connected', JSON.stringify({
      chat_id: chatId,
      username: msg.from.username,
      first_name: msg.from.first_name,
    }));

    // Отправляем приветствие + кнопку с конфигуратором
    const configUrl = `${CONFIGURATOR_URL}?lead=${leadId}`;
    const welcomeText = getWelcomeMessage(lead.name);

    await bot.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [[
          { text: '🎂 Собрать праздник', url: configUrl }
        ]]
      }
    });

    // Обновляем статус
    statements.markLinkSent.run(leadId);
    statements.addEvent.run(leadId, 'link_sent_telegram', JSON.stringify({ configUrl }));

    console.log(`[TG BOT] Ссылка отправлена: ${lead.name} [${leadId}] → chat ${chatId}`);
  });

  // Handle any other messages
  bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/start')) return;

    const chatId = msg.chat.id;
    const lead = statements.getLeadByChat.get(String(chatId), 'telegram');

    if (lead) {
      // Log client message to database events
      statements.addEvent.run(lead.id, 'client_message', msg.text || '[Медиафайл]');
      console.log(`[TG BOT] Сообщение от ${lead.name}: ${msg.text}`);
    }
  });

  return bot;
}

/**
 * Отправить произвольное сообщение клиенту
 */
export async function sendMessage(chatId, text) {
  if (!bot) return false;
  try {
    await bot.sendMessage(chatId, text);
    return true;
  } catch (error) {
    console.error(`[TG BOT] Ошибка отправки:`, error.message);
    return false;
  }
}

/**
 * Отправить файл клиенту (фото, видео, аудио, документ)
 */
export async function sendAttachment(chatId, filePath, mimeType, caption = '') {
  if (!bot) return false;
  try {
    const opts = caption ? { caption } : {};
    if (mimeType.startsWith('image/')) {
      await bot.sendPhoto(chatId, filePath, opts);
    } else if (mimeType.startsWith('video/')) {
      await bot.sendVideo(chatId, filePath, opts);
    } else if (mimeType.startsWith('audio/')) {
      await bot.sendAudio(chatId, filePath, opts);
    } else {
      await bot.sendDocument(chatId, filePath, opts);
    }
    return true;
  } catch (error) {
    console.error(`[TG BOT] Ошибка отправки файла:`, error.message);
    return false;
  }
}

/**
 * Получить инстанс бота для webhook обработки
 */
export function getTelegramBot() {
  return bot;
}
