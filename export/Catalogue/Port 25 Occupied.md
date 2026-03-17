1. Edit the master configuration file of postfix using the following command:
```
vim /etc/postfix/master.cf
```

2. Locate the line that specifies port 25 and modify it to use a different port, such as 2525:
```
smtp            inet      n      -       n       -       -        smtpd
```

Change it to:
```
2525            inet      n      -       n       -       -        smtpd
```

3. Save the changes and exit the file.

4. Apply the modifications to postfix by restarting the service:
```
/etc/init.d/postfix restart
```
