#!/bin/bash

# Script used for setting up the server. Only needs to be run once by the root user.
# Then the root user and root login must be disabled.

set -x   # display commands being executed on the screen

# Update and install all required dependencies
apt update && apt upgrade &&
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&                                    # node
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list &&   # yarn
apt install -y git vim nodejs yarn docker docker-compose nginx unattended-upgrades apt-listchanges bsd-mailx

# Ditch snap forever
systemctl disable snapd.service &&
systemctl disable snapd.socket &&
systemctl disable snapd.seeded.service &&
rm -rf /var/cache/snapd/ &&
apt autoremove --purge snapd gnome-software-plugin-snap &&
rm -rf ~/snap &&
apt-mark hold snapd

# Unattended upgrades
sudo dpkg-reconfigure -plow unattended-upgrades &&
# This should be done automatically through sed or tee or something
sudo vim /etc/apt/apt.conf.d/50unattended-upgrades
sudo vim /etc/apt/listchanges.conf

# Set up user
useradd -m -G sudo,docker -s /bin/bash deni
cp -r /root/.ssh /home/deni/
