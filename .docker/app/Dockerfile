FROM node:18.12.0-slim

WORKDIR /home/node/app

COPY ./backend .

RUN npm install

EXPOSE 3001

CMD ["npm", "run","dev"]