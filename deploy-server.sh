#!/bin/bash

######################################################################################
# Script used for setting up the server. Only needs to be run once by the root user.
# Then the root user and root login must be disabled.
######################################################################################

verify_file() {
  echo -e "\nPlease check the correctness of the $1 file... (press ENTER)" && read &&
  diff $2 "$2.bak" | less &&
  echo -e "\nIs everything correct? (y/n)" && read ANSWER

  if [ $ANSWER = 'n' ] || [ $ANSWER = 'N' ]; then
    echo "Would you like to edit the original version (o) or the new version (n)? (o/n)" && read ANSWER

    if [ $ANSWER = 'o' ] || [ $ANSWER = 'O' ]; then
      cp "$2.bak" $2
    fi
    vim $2
  fi
  rm -f "$2.bak"
}

# Update and install all required dependencies
echo -e "\nUpdating system and installing dependencies... (press ENTER)" && read &&
apt update && apt upgrade &&
apt install -y git vim docker docker-compose ufw fail2ban nginx unattended-upgrades apt-listchanges bsd-mailx &&

# Ditch snap forever
echo -e "\nRemoving snap... (press ENTER)" && read &&
systemctl disable snapd.service &&
systemctl disable snapd.socket &&
systemctl disable snapd.seeded.service &&
rm -rf /var/cache/snapd/ &&
apt autoremove -y --purge snapd gnome-software-plugin-snap &&
rm -rf ~/snap &&
apt-mark hold snapd &&

# Add swapfile
echo -e "\nCreating swapfile. Please give the size in GB:" && read SWAP_GB &&
fallocate -l ${SWAP_GB}G /swapfile &&
chmod 600 /swapfile &&
mkswap /swapfile &&
swapon /swapfile &&
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab &&
echo -e "\nvm.swappiness=10\nvm.vfs_cache_pressure=50" | tee -a /etc/sysctl.conf &&
swapon --show &&

# Unattended upgrades
echo -e "\nSetting up unattended upgrades... (press ENTER)" && read &&
dpkg-reconfigure --priority=low unattended-upgrades &&
# Send email notifications about upgrades
#vim /etc/apt/apt.conf.d/50unattended-upgrades &&
#vim /etc/apt/listchanges.conf &&

# SSHD config
echo -e "\nSetting up SSH configuration. Choose SSH port:" && read SSH_PORT &&
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak &&
# This assumes that the given lines exist in the first place
sed -E "s/^#?Port.*/Port ${SSH_PORT}/" /etc/ssh/sshd_config.bak |
sed -E 's/^#?PermitRootLogin.*/PermitRootLogin no/' |
sed -E 's/^#?PubkeyAuthentication.*/PubkeyAuthentication yes/' |
sed -E 's/^#?MaxAuthTries.*/MaxAuthTries 5/' |
sed -E 's/^#?MaxSessions.*/MaxSessions 2/' |
sed -E 's/^#?PasswordAuthentication.*/PasswordAuthentication no/' |
sed -E 's/^#?ClientAliveInterval.*/ClientAliveInterval 300/' |
sed -E 's/^#?ClientAliveCountMax.*/ClientAliveCountMax 1/' |
sed -E 's/^#?X11Forwarding.*/X11Forwarding no/' |
sed -e '$a \\' -e '$a AllowGroups sudo' |
tee /etc/ssh/sshd_config > /dev/null &&
verify_file 'SSH config' /etc/ssh/sshd_config &&

# Firewall
echo -e "\nSetting up firewall... (press ENTER)" && read &&
ufw allow $SSH_PORT &&
ufw allow http &&
ufw allow https &&
ufw enable &&
ufw status &&
# Fail2ban
echo -e "\nEnabling Fail2ban... (press ENTER)" && read &&
systemctl enable fail2ban --now &&

# Nginx
echo -e "\nSetting up Nginx. Please enter your domain name (xxx.yyy):" && read DOMAIN &&
echo "Please enter the port your server is listening on:" && read SERVER_PORT &&
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak &&
sed -E '/# First attempt to/d' /etc/nginx/sites-available/default.bak |
sed -E '/# as directory, then/d' |
sed -E "s/.*server_name _;/\tserver_name ${DOMAIN} www.${DOMAIN};/" |
sed -E "s/^\s*try_files.*/\t\tproxy_pass http:\/\/localhost:${SERVER_PORT};\n\t\tproxy_http_version 1.1;\n\t\tproxy_set_header Upgrade \$http_upgrade;\n\t\tproxy_set_header Connection 'upgrade';\n\t\tproxy_set_header Host \$host;\n\t\tproxy_cache_bypass \$http_upgrade;/" |
tee /etc/nginx/sites-available/default > /dev/null &&
verify_file 'Nginx config' /etc/nginx/sites-available/default &&
systemctl restart nginx &&
nginx -t &&  # check nginx status

# Set up user
echo -e "\nSetting up new user. Please enter username:" && read MY_USERNAME &&
useradd -m -G sudo,adm,docker -s /bin/bash $MY_USERNAME &&
passwd $MY_USERNAME &&
# SSH key setup (this assumes that there is already a public key set up for the root user)
cp -r /root/.ssh /home/$MY_USERNAME/ &&
chown -vR $MY_USERNAME:$MY_USERNAME /home/$MY_USERNAME/.ssh &&

# .bashrc file changes
echo -e "\nChanging .bashrc file... (press ENTER)" && read &&
cp /home/$MY_USERNAME/.bashrc /home/$MY_USERNAME/.bashrc.bak &&
# Environment variables
echo -e "Please input Mongo DB admin username:" && read MONGO_ADMIN_USERNAME &&
echo -e "\nPlease input Mongo DB admin password:" && read MONGO_ADMIN_PASSWORD &&
echo -e "\nPlease input Mongo DB developer username:" && read MONGO_DEV_USERNAME &&
echo -e "\nPlease input Mongo DB developer password:" && read MONGO_DEV_PASSWORD &&
echo -e "\n# Custom additions" |
sed -e "\$a export MONGO_ADMIN_USERNAME=$MONGO_ADMIN_USERNAME" |
sed -e "\$a export MONGO_ADMIN_PASSWORD=$MONGO_ADMIN_PASSWORD" |
sed -e "\$a export MONGO_DEV_USERNAME=$MONGO_DEV_USERNAME" |
sed -e "\$a export MONGO_DEV_PASSWORD=$MONGO_DEV_PASSWORD" |
# Prompt (keep in mind that this way of escaping special characters may not work in other shells)
sed -e '$a PS1='\''\\[\\033[1;36m\\]\\u \\[\\e[1;32m\\]\\w \\[\\e[00m\\]\\$ '\' |
tee -a /home/$MY_USERNAME/.bashrc > /dev/null &&
verify_file '.bashrc' /home/$MY_USERNAME/.bashrc &&

# Aliases
echo 'alias l="ls"' |
sed -e '$a alias ls="ls --color=auto"' |
sed -e '$a alias la="ls -a"' |
sed -e '$a alias ll="ls -l"' |
sed -e '$a alias rm="rm -i"' |
sed -e '$a alias mv="mv -i"' |
sed -e '$a alias cp="cp -i"' |
sed -e '$a alias g="git"' |
sed -e '$a alias d="docker"' |
sed -e '$a alias dco="docker-compose"' |
tee /home/$MY_USERNAME/.bash_aliases &&
chown -v $MY_USERNAME:$MY_USERNAME /home/$MY_USERNAME/.bash_aliases &&
echo -e "\nSee .bash_aliases file contents above... (press ENTER)" && read &&

# Clone repo, cd into it and install packages
echo -e "\nSetting up repo... (press ENTER)" && read &&
cd /home/$MY_USERNAME &&
git clone https://github.com/dmint789/denimintsaev.com.git &&
chown -vR $MY_USERNAME:$MY_USERNAME /home/$MY_USERNAME/denimintsaev.com &&

echo -e "\nDeployment complete! Reboot? (y/n)" && read ANSWER
if [ $ANSWER = 'y' ] || [ $ANSWER = 'Y' ]; then
  reboot
fi
