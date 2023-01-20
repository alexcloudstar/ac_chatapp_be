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


FROM base as development

COPY .env /app/

EXPOSE 4000

ENV ARG NODE_ENV=development

CMD [ "yarn", "start:dev"]

FROM base as production

RUN yarn build

COPY .env /app/

EXPOSE 4000

ENV ARG NODE_ENV=production

CMD [ "yarn", "start:prod"]
