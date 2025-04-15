FROM node:22-alpine

WORKDIR ./app

COPY package.json ./app

RUN npm install

COPY . ./app

RUN npm build

CMD ["npm", "run", "start"]