# Linux Setup Guide Cheat sheet

## SSH

Edit `/etc/ssh/sshd_config` for:

### Change Port Number
```
Port xxxx
```

### Restrict root login
```
PermitRootLogin no
```

### Restrict SSH User accounts
```
AllowUsers <user>
```

### Disable X11Forwarding
```
X11Forwarding no
```

### Setup public key authentication
1. On connecting machine generate keys. (I recommend a different password then the user account password if you opt for a password protected key)
	```bash
	ssh-keygen
	```
2. Copy key to remote machine from connecting machine
	```bash
	ssh-copy-id -i <identity_file> -p <port> <user>@<ip> 
	```
3. You should now be able to connect to the the remote host without the remote users password.


### Disable password login
```
PasswordAuthentication no
```


> Note: Run `sudo systemctl reload sshd` after making changes to `/etc/ssh/sshd_config`


## Firewall

### Install UFW
    sudo apt install ufw


### Commands
    sudo ufw enable
    sudo ufw disable
    sudo ufw status
    sudo ufw show added
    sudo ufw allow <port>/<optional: protocol>
    sudo ufw deny <port>/<optional: protocol>
    sudo ufw reload
    sudo ufw reset      # Completely reset ufw to its defaults

### Disable IPV6
Not all networks use IPV6 yet. If you are not using it, you should disable it.

1. Edit `/etc/default/ufw`
    ```txt
    IPV6=no
    ```
2. Reload the firewall
    ```bash
    sudo ufw reload
    ```

## Updating Linux

### Commands
	sudo apt update
	sudo apt upgrade
	sudo apt full-upgrade
	sudo apt autoremove
	sudo apt autoclean

## Install Docker

1. Follow instructions here: https://docs.docker.com/engine/install/ubuntu/

2. Docker punches through UFW. Follow the steps here to change that: https://github.com/chaifeng/ufw-docker?tab=readme-ov-file#ufw-docker-util

