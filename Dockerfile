FROM node:16-alpine

COPY app /home

WORKDIR /home/app

RUN apk update && apk upgrade

RUN yarn install && yarn build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV BACKEND_PORT=5000
ENV API_URL='http://localhost:5000/'
ENV API_URL_BROWSER='https://denimintsaev.com/api/'

EXPOSE 3000
EXPOSE 5000

CMD [ "yarn", "start" ]
