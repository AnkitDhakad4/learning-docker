FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

#  the react server must run on this port (we can change it in the vite.config.js file)
EXPOSE 3000

CMD ["npm","run","dev"]