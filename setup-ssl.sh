#!/bin/bash

# SSL setup. This must be done after the website has been deployed to a domain name.

sudo apt install -y python3-certbot-nginx &&
certbot --nginx -d $DOMAIN -d www.$DOMAIN &&
certbot renew --dry-run
