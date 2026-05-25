#!/bin/bash
# Быстрое обновление сервера после пуша в гит
cd /root/planner-park
git pull origin main
cd server
npm install --production
pm2 restart dr-server
echo "✅ Обновлено и перезапущено!"
