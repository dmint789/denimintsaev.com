#!/bin/bash

# Get environment variables
source ./.env

# Display commands being executed on the screen
set -x

# Restart docker containers while rebuilding the server image
docker-compose down &&
docker-compose up -d --build
