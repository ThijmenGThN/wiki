### This has been tested on

- Ubuntu 20.04

### Get started

Expanding your logical volume on your system via the following commands:

**1. Install parted**
```
apt install -y parted
```

**2. Open parted**
```
parted
```

**2a. Print partitions**
```
print
```

**2b. Resize partition**
```
resizepart
```

**2c. Quit parted**
```
quit
```

**3. Resize physical volume**
```
pvresize /dev/sda3
```

**4. Extend logical volume**
```
lvextend /dev/ubuntu-vg/ubuntu-lv -l+100%FREE
```

**5. Resize filesystem**
```
resize2fs /dev/ubuntu-vg/ubuntu-lv
```
