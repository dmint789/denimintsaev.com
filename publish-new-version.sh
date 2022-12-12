#!/bin/bash

git tag &&
echo "Please give the new version tag:" && read NEW_VERSION

if [ -z $1 ] || [ $1 != 'nogit' ]; then
  git push origin main &&
  git tag --force -a $NEW_VERSION -m "Version $NEW_VERSION" &&
  git push --force origin --tags
fi

if [ -z $1 ] || [ $1 != 'nodocker' ]; then
  docker login -u denimint
  docker rm --force denimintsaev-api
  docker rmi denimint/denimintsaev.com-api:latest
  docker rmi denimint/denimintsaev.com-client:latest
  # Remove all images that contain "denimint"
  docker images | grep denimint | tr -s ' ' | cut -d ' ' -f 3 | xargs docker rmi
  # API container
  docker build -t denimint/denimintsaev.com-api:$NEW_VERSION --file server.Dockerfile . &&
  docker tag denimint/denimintsaev.com-api:$NEW_VERSION denimint/denimintsaev.com-api:latest &&
  docker push denimint/denimintsaev.com-api:$NEW_VERSION &&
  docker push denimint/denimintsaev.com-api:latest &&
  # Client container
  docker build -t denimint/denimintsaev.com-client:$NEW_VERSION --file client.Dockerfile . &&
  docker tag denimint/denimintsaev.com-client:$NEW_VERSION denimint/denimintsaev.com-client:latest &&
  docker push denimint/denimintsaev.com-client:$NEW_VERSION &&
  docker push denimint/denimintsaev.com-client:latest
fi

echo -e "\nDone!"
