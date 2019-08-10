FROM node:lts-alpine

LABEL maintainer="jacob@jacobgc.me"

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY . /usr/src/app/

RUN ["npm", "install", "yarn", "--global"]
RUN ["yarn", "global", "add", "typescript"]
RUN ["yarn", "install"]
RUN ["tsc"]

CMD [ "node", "dist/index.js"]