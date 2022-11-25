FROM node:18

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

ENV NODE_ENV development

EXPOSE 4000

CMD [ "yarn", "start:dev"]
