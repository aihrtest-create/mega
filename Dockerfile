FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# puppeteer и sharp нужны только локальным скриптам — в сборке фронтенда
# их бинарники (Chromium ~300МБ) не используются, не качаем
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install
COPY . .
# IT-команда должна передать URL своего сервера при сборке
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
# Скопировать билд в папку mega, так как проект использует base: '/mega/'
COPY --from=builder /app/dist /usr/share/nginx/html/mega
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
