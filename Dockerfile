FROM node:20-alpine

ENV APP_HOME /app
WORKDIR $APP_HOME

COPY package.json .
COPY yarn.lock .

RUN yarn install
