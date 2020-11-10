FROM node:12

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "create_container_terminal.js"]