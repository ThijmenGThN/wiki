### Tested on

- PVE 7.1-10.x
- PVE 8.0-1.x

## Subscription notice removal script

Paste the following command in your PVE Node it's Shell:

```
sed -Ezi.bak "s/(Ext.Msg.show\(\{\s+title: gettext\('No valid sub)/void\(\{ \/\/\1/g" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js && systemctl restart pveproxy.service
```
