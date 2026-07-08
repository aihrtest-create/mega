import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

console.log('🏁 Запуск postbuild-скрипта копирования и локализации HTML-файлов...');

if (!fs.existsSync(indexPath)) {
  console.error(`❌ Ошибка: Файл index.html не найден в директории сборки: ${indexPath}`);
  process.exit(1);
}

// Чтение исходного index.html
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Создание invite.html (копия index.html по умолчанию для русского языка)
const inviteRuPath = path.join(distDir, 'invite.html');
let htmlInviteRu = html
  .replace(
    '<title>Hello Park — Конструктор Дня Рождения 🎉</title>',
    '<title>Hello Park — Приглашение на День Рождения 🎉</title>'
  )
  .replace(
    'content="Hello Park — Конструктор Дня Рождения"',
    'content="Вам прислали приглашение! Откройте конверт ✉️"'
  )
  .replace(
    'content="Соберите идеальный День Рождения в интерактивном парке будущего Hello Park!"',
    'content="Присоединяйтесь к празднованию Дня Рождения в интерактивном парке будущего Hello Park!"'
  )
  .replace(
    '</head>',
    '  <meta property="og:image" content="/mega/images/og_ru.png" />\n      <meta name="twitter:image" content="/mega/images/og_ru.png" />\n    </head>'
  );
fs.writeFileSync(inviteRuPath, htmlInviteRu, 'utf8');
console.log('✅ Успешно создан dist/invite.html (Русская локализация)');

// 2. Создание invite-en.html (Английская локализация)
let htmlEn = html
  .replace(
    '<title>Hello Park — Конструктор Дня Рождения 🎉</title>',
    '<title>Hello Park — Birthday Party Invitation 🎉</title>'
  )
  .replace(
    'content="Hello Park — Конструктор Дня Рождения"',
    'content="You have received an invitation! Open the envelope ✉️"'
  )
  .replace(
    'content="Соберите идеальный День Рождения в интерактивном парке будущего Hello Park!"',
    'content="Join the Birthday celebration at the interactive park of the future Hello Park!"'
  )
  .replace(
    '</head>',
    '  <meta property="og:image" content="/mega/images/og_en.png" />\n      <meta name="twitter:image" content="/mega/images/og_en.png" />\n    </head>'
  );

const inviteEnPath = path.join(distDir, 'invite-en.html');
fs.writeFileSync(inviteEnPath, htmlEn, 'utf8');
console.log('✅ Успешно создан dist/invite-en.html (Английская локализация)');

// 3. Создание invite-ar.html (Арабская локализация)
let htmlAr = html
  .replace(
    '<title>Hello Park — Конструктор Дня Рождения 🎉</title>',
    '<title>هلو بارك — دعوة لحضور عيد ميلاد 🎉</title>'
  )
  .replace(
    'content="Hello Park — Конструктор Дня Рождения"',
    'content="لقد تلقيت دعوة! افتح المغلف ✉️"'
  )
  .replace(
    'content="Соберите идеальный День Рождения в интерактивном парке будущего Hello Park!"',
    'content="انضم إلى الاحتفال بعيد الميلاد في حديقة المستقبل التفاعلية هلو بارك!"'
  )
  .replace(
    '</head>',
    '  <meta property="og:image" content="/mega/images/og_ar.png" />\n      <meta name="twitter:image" content="/mega/images/og_ar.png" />\n    </head>'
  );

const inviteArPath = path.join(distDir, 'invite-ar.html');
fs.writeFileSync(inviteArPath, htmlAr, 'utf8');
console.log('✅ Успешно создан dist/invite-ar.html (Арабская локализация)');

// 4. Создание invite-dashboard.html для поддержки старых ссылок (и для того, чтобы работал дашборд)
fs.writeFileSync(path.join(distDir, 'invite-dashboard.html'), htmlInviteRu, 'utf8');
fs.writeFileSync(path.join(distDir, 'invite-dashboard-en.html'), htmlEn, 'utf8');
fs.writeFileSync(path.join(distDir, 'invite-dashboard-ar.html'), htmlAr, 'utf8');
console.log('✅ Успешно созданы файлы invite-dashboard.html (для обратной совместимости ссылок дашборда)');


console.log('🎉 Все локализованные HTML-файлы успешно сгенерированы в dist/!');
