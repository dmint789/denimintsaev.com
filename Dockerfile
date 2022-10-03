FROM node:16-alpine

COPY app /home

WORKDIR /home/app

RUN apk update && apk upgrade

RUN yarn install && yarn build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV BACKEND_PORT=5000
ENV API_URL='https://denimintsaev.com/'
ENV BROWSER_BASE_URL='https://denimintsaev.com/'

EXPOSE 3000

CMD [ "yarn", "start" ]
