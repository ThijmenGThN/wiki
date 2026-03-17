Improved readme instructions:

1. Open the shell on your node.
2. Navigate to the directory `/etc/pve/lxc`.
3. Locate and open the configuration file for the LXC that you want to modify.
4. At the end of the config file, add the following rules:
```
lxc.cgroup.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net dev/net none bind,create=dir
```
5. Save the config file and exit the editor.
6. Reboot the LXC to apply the changes.
7. After the reboot, the error should now be resolved.
