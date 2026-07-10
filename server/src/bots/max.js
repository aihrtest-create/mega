import { statements } from '../database.js';
import { buildConfiguratorUrl } from '../config/amo-config.js';

let bot = null;

const CONFIGURATOR_URL = process.env.CONFIGURATOR_URL || 'https://party.hello-park.io/mega/';

/**
 * Генерирует текст приветственного сообщения
 */
function getWelcomeMessage(name) {
  const greetings = [
    `Здравствуйте, ${name}! 😊\n\nМеня зовут Анна, я банкетный менеджер Hello Park. Спасибо за вашу заявку на проведение дня рождения!\n\nЯ подготовила для вас персональный конфигуратор праздника — с его помощью вы сможете выбрать формат, квесты, шоу-программы, меню и все остальные детали.\n\nНажмите на кнопку ниже, чтобы начать 👇`,
    `Добрый день, ${name}! 🎉\n\nЭто Анна из Hello Park. Рада, что вы выбрали нас для проведения праздника!\n\nСпециально для вас подготовлен конфигуратор — вы сможете собрать идеальный день рождения, выбрав все опции по вкусу.\n\nНажмите кнопку ниже, чтобы начать оформление 👇`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Инициализация Max бота
 * @maxhub/max-bot-api — официальная библиотека
 */
export async function initMaxBot() {
  const token = process.env.MAX_BOT_TOKEN;
  if (!token || token === 'your_max_bot_token_here') {
    console.log('[MAX BOT] ⚠️  Max токен не настроен. Бот не запущен.');
    return null;
  }

  try {
    // Dynamic import because the library might not be installed yet
    const { Bot, Keyboard } = await import('@maxhub/max-bot-api');

    bot = new Bot(token);

    // Handle /start command with deeplink payload
    bot.on('bot_started', async (ctx) => {
      const payload = ctx.update?.payload;
      const user = ctx.update?.user;
      const chatId = ctx.update?.chat_id;

      if (!payload) {
        // Пользователь просто открыл бота без диплинка
        const keyboard = Keyboard.inlineKeyboard([
          [Keyboard.button.link('🌐 Перейти на сайт', CONFIGURATOR_URL)]
        ]);
        await ctx.reply(
          'Здравствуйте! 👋\n\nЯ — ассистент Hello Park. Чтобы начать оформление праздника, оставьте заявку на нашем сайте, и я пришлю вам персональный конфигуратор!',
          { attachments: [keyboard] }
        );
        return;
      }

      // Payload содержит ID лида (format: lead_XXXXX)
      const leadId = payload.replace('lead_', '');
      const lead = statements.getLead.get(leadId);

      if (!lead) {
        await ctx.reply('Извините, не удалось найти вашу заявку. Пожалуйста, попробуйте ещё раз через сайт.');
        return;
      }

      // Связываем бота с лидом
      statements.connectBot.run(
        String(chatId || user?.user_id),
        user?.username || '',
        leadId
      );
      statements.addEvent.run(leadId, 'max_connected', JSON.stringify({
        chat_id: chatId,
        username: user?.username,
        name: user?.name,
      }));

      // Отправляем приветствие + кнопку
      const configUrl = buildConfiguratorUrl(leadId);
      const welcomeText = getWelcomeMessage(lead.name);

      const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.link('🎂 Собрать праздник', configUrl)]
      ]);

      await ctx.reply(welcomeText, { attachments: [keyboard] });

      // Обновляем статус
      statements.markLinkSent.run(leadId);
      statements.addEvent.run(leadId, 'link_sent_max', JSON.stringify({ configUrl }));

      console.log(`[MAX BOT] Ссылка отправлена: ${lead.name} [${leadId}]`);
    });

    // Handle regular messages
    bot.on('message_created', async (ctx) => {
      const chatId = ctx.update?.message?.recipient?.chat_id;
      const userId = ctx.update?.message?.sender?.user_id;
      const lookupId = String(chatId || userId);

      const lead = statements.getLeadByChat.get(lookupId, 'max');

      if (lead && lead.status === 'submitted') {
        await ctx.reply('Спасибо за ваше сообщение! Менеджер свяжется с вами в ближайшее время для подтверждения деталей праздника. 🎉');
      } else if (lead) {
        const configUrl = `${CONFIGURATOR_URL}?lead=${lead.id}`;
        const keyboard = Keyboard.inlineKeyboard([
          [Keyboard.button.link('🎂 Собрать праздник', configUrl)]
        ]);
        await ctx.reply('Если вы ещё не заполнили конфигуратор, нажмите на кнопку ниже 👇', {
          attachments: [keyboard]
        });
      } else {
        const keyboard = Keyboard.inlineKeyboard([
          [Keyboard.button.link('🌐 Перейти на сайт', CONFIGURATOR_URL)]
        ]);
        await ctx.reply('Здравствуйте! Чтобы начать оформление праздника, оставьте заявку на нашем сайте.', {
          attachments: [keyboard]
        });
      }
    });

    const serverUrl = process.env.SERVER_URL;
    const useWebhook = serverUrl && serverUrl.startsWith('https://');

    if (useWebhook) {
      const webhookUrl = `${serverUrl}/webhook/max`;
      // Register webhook with Max API
      fetch('https://botapi.max.ru/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: ['bot_started', 'message_created']
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(`[MAX BOT] ✅ Webhook установлен: ${webhookUrl}`);
        } else {
          console.error(`[MAX BOT] ❌ Ошибка установки webhook:`, data);
        }
      })
      .catch(err => console.error(`[MAX BOT] ❌ Ошибка при установке webhook:`, err.message));
    } else {
      // Start the bot with long polling if no HTTPS server URL is available
      bot.start();
      console.log('[MAX BOT] ✅ Запущен в режиме Long Polling');
    }

    return bot;
  } catch (error) {
    console.error('[MAX BOT] ❌ Ошибка запуска:', error.message);
    return null;
  }
}

/**
 * Отправить произвольное сообщение клиенту в Max (из дашборда)
 */
export async function sendMessage(chatId, text) {
  if (!bot) return false;
  try {
    const token = process.env.MAX_BOT_TOKEN;
    const res = await fetch(`https://botapi.max.ru/messages?chat_id=${chatId}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return res.ok;
  } catch (e) {
    console.error(`[MAX BOT] Ошибка отправки:`, e.message);
    return false;
  }
}

/**
 * Отправить файл клиенту в Max
 */
export async function sendAttachment(chatId, filePath, mimeType, caption = '') {
  try {
    const token = process.env.MAX_BOT_TOKEN;
    const fs = await import('fs');
    const path = await import('path');
    const { FormData, File } = await import('undici');

    // Step 1: Upload file to Max
    const fileBuffer = fs.default.readFileSync(filePath);
    const fileName = path.default.basename(filePath);
    const file = new File([fileBuffer], fileName, { type: mimeType });

    const uploadForm = new FormData();
    uploadForm.append('data', file);

    const uploadType = mimeType.startsWith('image/') ? 'image' :
                       mimeType.startsWith('video/') ? 'video' : 'file';

    const uploadRes = await fetch(`https://botapi.max.ru/uploads?type=${uploadType}`, {
      method: 'POST',
      headers: { 'Authorization': token },
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      console.error('[MAX BOT] Upload failed:', await uploadRes.text());
      return false;
    }

    // Step 2: Send message with attachment
    const uploadData = await uploadRes.json();
    const msgBody = {
      text: caption || undefined,
      attachments: [uploadData],
    };

    const msgRes = await fetch(`https://botapi.max.ru/messages?chat_id=${chatId}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msgBody),
    });
    return msgRes.ok;
  } catch (e) {
    console.error(`[MAX BOT] Ошибка отправки файла:`, e.message);
    return false;
  }
}

/**
 * Отправить уведомление клиенту в Max
 */
export async function notifyMaxUser(userId, message) {
  if (!bot) return;
  try {
    await bot.api.sendMessageToUser(Number(userId), message);
  } catch (error) {
    console.error(`[MAX BOT] Ошибка отправки пользователю ${userId}:`, error.message);
  }
}

export function getMaxBot() {
  return bot;
}
