FROM node:16-alpine

COPY app /home

WORKDIR /home/app

RUN apk update && apk upgrade

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV BACKEND_PORT=5000
ENV API_URL='http://denimintsaev.com/'
ENV API_URL_BROWSER='https://denimintsaev.com/'

RUN yarn install && yarn build

EXPOSE 3000
EXPOSE 5000

CMD [ "yarn", "start" ]
