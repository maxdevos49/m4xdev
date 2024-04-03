# Linux Setup Guide Cheat sheet

## SSH

Change Port Number

Restrict SSH User accounts

Restrict root login

Add RSA public private key

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

