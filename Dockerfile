FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/ui

RUN npm install && npm run build && rm -rf node_modules

WORKDIR /app

EXPOSE 80

ENV FASTIFY_ADDRESS=0.0.0.0 PORT=80

CMD ["npm", "start"]