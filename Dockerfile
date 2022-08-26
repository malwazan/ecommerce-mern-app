FROM node:16.15-alpine3.14

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY api/ .

RUN npm install

EXPOSE 5000

CMD ["npm","start"]