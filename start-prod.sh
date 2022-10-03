#!/bin/bash

# Script for restarting production environment

# Pull from Github
git pull &&

# Restart docker containers with new version of the server image
docker-compose down &&
docker rmi denimint/denimintsaev.com:latest &&
docker-compose up -d
