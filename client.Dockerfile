FROM node:18-alpine

RUN apk update && apk upgrade

COPY client /home/app

WORKDIR /home/app

# Nuxt host & port
ENV HOST=0.0.0.0
ENV PORT=3000
# API base URL (my own variable)
ENV API_BASE_URL='https://denimintsaev.com/api'

RUN npm install && npm run build

# Same as the port above
EXPOSE 3000

CMD [ "npm", "start" ]
