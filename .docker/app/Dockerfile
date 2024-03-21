FROM node:18.12.0-slim

WORKDIR /home/node/app

COPY ../../backend/package*.json ./

RUN npm ci

CMD ["npm","run","dev"]