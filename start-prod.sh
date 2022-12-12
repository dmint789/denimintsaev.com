#!/bin/bash

################################################
# Script for (re)starting production environment #
################################################

# Pull from Github
git pull &&

# Restart docker containers with new version of the server image
docker-compose down &&
# Remove all images that contain "denimint"
docker images | grep denimint | tr -s ' ' | cut -d ' ' -f 3 | xargs docker rmi
docker-compose up -d
