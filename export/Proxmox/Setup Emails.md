## Email configuration

##Configuring User E-mail Address

- In a web browser, navigate to the Proxmox web UI and login
- Select Datacenter > Permissions > Users from the left navigation menus
- Double click the user to configure
- Complete the E-mail field on the Edit User form > Click OK

### Simple Configuration via Web UI

*By default, Proxmox will try to use the domain portion of the "Email from address" as the e-mail relay server.*

- Select Datacenter > Options from the left navigation menus
- Double click the Email from address field
- Enter the e-mail address that Proxmox will send outgoing e-mails from > Click OK
- Expand Datacenter > Select the node name > Click Shell in the left navigation menus
- Run the following commands in the terminal

```
# send a basic test email
echo "Test email from Proxmox: $(hostname)" | /usr/bin/pvemailforward
# output the mail log
cat /var/log/mail.log
```

### Advanced Configuration via CLI

*To make more advanced configuration changes, like using a gmail account, you need to edit the postfix settings via command line.*

- Back in the Proxmox web shell, run the following commands in the terminal.

```
# install libsasl
apt install libsasl2-modules -y
# edit the postfix config
nano /etc/postfix/main.cf
```

- Press CTRL+W and search for mydestination
- Comment out mydestination by adding a # to the beginning of the line
- Press CTRL+W and search for relayhost
- Comment out relayhost by adding a # to the beginning of the line
- Update or add the following configuration

```
relayhost = smtp.gmail.com:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options =
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/Entrust_Root_Certification_Authority.pem
```

- Press CTRL+O, Enter, CTRL+X to write the changes
- Continue with the following commands in the terminal

```
# create /etc/postfix/sasl_passwd
nano /etc/postfix/sasl_passwd
```

- Add a line to configure gmail authentication

```
smtp.gmail.com:587 <%youraccount%>@gmail.com:<%yourpassword%>
```

- Press CTRL+O, Enter, CTRL+X to write the changes
- Continue with the following commands in the terminal

```
# update postfix lookup tables
postmap hash:/etc/postfix/sasl_passwd
# limit access to sasl_passwd to only root
chmod 600 /etc/postfix/sasl_passwd
# restart postfix service
systemctl restart postfix
# test from postfix directly
echo "Test email from Proxmox: $(hostname)" | mail -s "Proxmox Testing" <%youraccount%>@gmail.com
# send a test from proxmox
echo "Test email from Proxmox: $(hostname)" | /usr/bin/pvemailforward
```
