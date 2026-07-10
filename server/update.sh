#!/bin/bash
# Быстрое обновление сервера после пуша в гит
if [ -d "/root/mega" ]; then
  cd /root/mega
else
  cd /root/planner-park
fi
git pull origin main
cd server
npm install --production
pm2 restart dr-server
echo "✅ Обновлено и перезапущено!"
