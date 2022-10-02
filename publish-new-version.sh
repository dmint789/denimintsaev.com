#!/bin/bash

echo "Please give the new version tag:" && read NEW_VERSION
set -x

if [ -z $1 ] || [ $1 != 'nogit' ]; then
  git push origin main &&
  git tag --force -a $NEW_VERSION -m "Version $NEW_VERSION" &&
  git push --force origin --tags
fi

if [ -z $1 ] || [ $1 != 'nodocker' ]; then
  docker rmi denimint/denimintsaev.com:latest
  docker images | grep denimint | tr -s ' ' | cut -d ' ' -f 3 | xargs docker rmi
  docker build -t denimint/denimintsaev.com:$NEW_VERSION . &&
  docker login -u denimint &&
  docker tag denimint/denimintsaev.com:$NEW_VERSION denimint/denimintsaev.com:latest &&
  docker push denimint/denimintsaev.com:$NEW_VERSION &&
  docker push denimint/denimintsaev.com:latest
fi
