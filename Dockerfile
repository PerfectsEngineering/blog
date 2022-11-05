FROM node:16-buster as build

WORKDIR /app

ADD package.json ./

RUN npm install

ADD . ./

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

