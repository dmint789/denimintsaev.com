#!/bin/bash

# Get environment variables
source ./.env

# Display commands being executed on the screen
set -x

# Restart docker containers and load the server image from file
docker-compose down &&
docker load --input denimintsaev.tar &&
docker-compose up -d
