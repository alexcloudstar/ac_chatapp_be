FROM node:18 as base

WORKDIR /app

RUN chown -R node.node /app
RUN yarn global add prisma


COPY package*.json ./
COPY yarn.lock /yarn.lock
COPY prisma ./prisma/

RUN yarn install
RUN prisma generate

COPY . .

COPY .env /app/

EXPOSE 4000

FROM base as development

ENV ARG NODE_ENV

CMD [ "yarn", "start:dev"]

FROM base as production

RUN yarn build

ENV ARG NODE_ENV

CMD [ "yarn", "start:prod"]
