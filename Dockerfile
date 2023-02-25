FROM node:18.12-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

CMD ["yarn", "start:dev"]
