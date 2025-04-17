FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . ./

RUN npx prisma generate
RUN npm run build

EXPOSE 8000:8000
EXPOSE 8888:8888

CMD ["npm", "run", "start"]