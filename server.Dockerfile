FROM node:18-alpine

RUN apk update && apk upgrade

COPY server /home/app

WORKDIR /home/app

ENV PORT=5000

RUN npm install && npm run build

# Same as the port above
EXPOSE 5000

CMD [ "npm", "start" ]
