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
fs.writeFileSync(inviteRuPath, html, 'utf8');
console.log('✅ Успешно создан dist/invite.html (Русская локализация)');

// 2. Создание invite-en.html (Английская локализация)
let htmlEn = html
  .replace(
    '<title>Hello Park — Приглашение на День Рождения 🎉</title>',
    '<title>Hello Park — Birthday Party Invitation 🎉</title>'
  )
  .replace(
    'content="Вам прислали приглашение! Откройте конверт ✉️"',
    'content="You have received an invitation! Open the envelope ✉️"'
  )
  .replace(
    'content="Присоединяйтесь к празднованию Дня Рождения в интерактивном парке будущего Hello Park!"',
    'content="Join the Birthday celebration at the interactive park of the future Hello Park!"'
  )
  .replaceAll(
    'content="/mega/images/og_ru.png"',
    'content="/mega/images/og_en.png"'
  );

const inviteEnPath = path.join(distDir, 'invite-en.html');
fs.writeFileSync(inviteEnPath, htmlEn, 'utf8');
console.log('✅ Успешно создан dist/invite-en.html (Английская локализация)');

// 3. Создание invite-ar.html (Арабская локализация)
let htmlAr = html
  .replace(
    '<title>Hello Park — Приглашение на День Рождения 🎉</title>',
    '<title>هلو بارك — دعوة لحضور عيد ميلاد 🎉</title>'
  )
  .replace(
    'content="Вам прислали приглашение! Откройте конверт ✉️"',
    'content="لقد تلقيت دعوة! افتح المغلف ✉️"'
  )
  .replace(
    'content="Присоединяйтесь к празднованию Дня Рождения в интерактивном парке будущего Hello Park!"',
    'content="انضم إلى الاحتفال بعيد الميلاد في حديقة المستقبل التفاعلية هلو بارك!"'
  )
  .replaceAll(
    'content="/mega/images/og_ru.png"',
    'content="/mega/images/og_ar.png"'
  );

const inviteArPath = path.join(distDir, 'invite-ar.html');
fs.writeFileSync(inviteArPath, htmlAr, 'utf8');
console.log('✅ Успешно создан dist/invite-ar.html (Арабская локализация)');

console.log('🎉 Все локализованные HTML-файлы успешно сгенерированы в dist/!');
