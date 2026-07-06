FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
# Создаем папки для хранения базы данных и загрузок
RUN mkdir -p data uploads
EXPOSE 3002
CMD ["npm", "start"]
