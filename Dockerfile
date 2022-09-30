FROM node:16

COPY app /home

WORKDIR /home/app

RUN apt update && apt upgrade -y

RUN yarn install && yarn build

ENV BACKEND_PORT=5000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

#EXPOSE 3000

CMD [ "yarn", "start" ]
