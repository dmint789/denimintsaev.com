#!/bin/bash

# Script for restarting production environment

# Get environment variables
#source ./.env

# Pull from Github
git pull &&

# Restart docker containers and load the server image from file
#docker-compose  &&
#docker load --input denimintsaev.tar &&
#docker-compose up -d

# Stop old docker container, remove it and delete the image
docker stop denimintsaev &&
docker rm denimintsaev &&
docker rmi denimint/denimintsaev.com:latest &&
# Pull new image and run it
docker pull denimint/denimintsaev.com:latest &&
docker run -d -p 3000:3000 --name denimintsaev --restart always denimint/denimintsaev.com:latest
