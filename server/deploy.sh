#!/bin/bash
# ===================================================
#  Скрипт деплоя DR-Configurator Server на VPS
#  Запускать от root на Ubuntu 22.04
# ===================================================

set -e

echo "🚀 Начинаю установку DR-Configurator Server..."

# 1. Обновление системы
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# 2. Установка Node.js 20
echo "📦 Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Установка PM2 (менеджер процессов)
echo "📦 Установка PM2..."
npm install -g pm2

# 4. Установка nginx
echo "📦 Установка nginx..."
apt install -y nginx

# 5. Установка Git
apt install -y git

# 6. Клонирование репозитория
echo "📂 Клонирование проекта..."
cd /root
if [ -d "planner-park" ]; then
  cd planner-park && git pull origin main
else
  git clone https://github.com/aihrtest-create/planner-park.git
  cd planner-park
fi

# 7. Установка зависимостей сервера
echo "📦 Установка зависимостей..."
cd server
npm install --production

# 8. Создание .env (если не существует)
if [ ! -f .env ]; then
  echo "⚙️ Создание .env файла..."
  cp .env.example .env
  echo ""
  echo "⚠️  ВАЖНО: Отредактируйте /root/planner-park/server/.env"
  echo "   Вставьте токены ботов и URL сервера!"
  echo ""
fi

# 9. Создание директории для данных
mkdir -p data

# 10. Запуск через PM2
echo "🚀 Запуск сервера через PM2..."
pm2 stop dr-server 2>/dev/null || true
pm2 delete dr-server 2>/dev/null || true
pm2 start src/index.js --name dr-server
pm2 save
pm2 startup

# 11. Настройка nginx
echo "🌐 Настройка nginx..."
cat > /etc/nginx/sites-available/dr-server << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/dr-server /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo ""
echo "✅ =================================="
echo "✅  УСТАНОВКА ЗАВЕРШЕНА!"
echo "✅ =================================="
echo ""
echo "📊 Дашборд:  http://$(curl -s ifconfig.me)/dashboard"
echo "📄 Лендинг:  http://$(curl -s ifconfig.me)/landing"
echo "🔗 API:      http://$(curl -s ifconfig.me)/api/leads"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Отредактируйте /root/planner-park/server/.env"
echo "   2. Перезапустите: pm2 restart dr-server"
echo "   3. Для HTTPS: установите certbot (см. ниже)"
echo ""
echo "🔒 Для HTTPS (нужен домен):"
echo "   apt install certbot python3-certbot-nginx"
echo "   certbot --nginx -d ваш-домен.ru"
echo ""
