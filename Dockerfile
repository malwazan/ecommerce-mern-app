FROM node:16.15-alpine3.14

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY api/ .

RUN npm install

EXPOSE 5000

CMD ["npm","start"]