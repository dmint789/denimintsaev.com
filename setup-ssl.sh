#!/bin/bash

# SSL setup. This must be done after the website has been deployed to a domain name.

sudo apt install -y python3-certbot-nginx &&
certbot --nginx -d $DOMAIN -d www.$DOMAIN &&
certbot renew --dry-run

# The remaining time left for the certificate renewal timer can be checked with this command:
#sudo systemctl status certbot.timer
