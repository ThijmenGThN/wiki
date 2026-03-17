### 1. Register the Third-Party repo

Run **one of the following** in your PVE Node Shell depending on the codename of it's release.

|Codename|Command|
|-|-|
|Bionic|echo "deb https://apt.iteas.at/iteas bionic main" > /etc/apt/sources.list.d/iteas.list|
|Focal|echo "deb https://apt.iteas.at/iteas focal main" > /etc/apt/sources.list.d/iteas.list|
|Buster|echo "deb https://apt.iteas.at/iteas buster main" > /etc/apt/sources.list.d/iteas.list|
|Bullseye|echo "deb https://apt.iteas.at/iteas bullseye main" > /etc/apt/sources.list.d/iteas.list|

### 2. Install the auto mounter

```
sudo apt update
```

```
sudo apt install -y pve7-usb-automount
```

#### An error occured, here's a common solution.

This command adds a GPG key from the keyserver.ubuntu.com keyserver to the list of trusted keys on the system.

```
apt-key adv --recv-keys --keyserver keyserver.ubuntu.com <your-key-displayed-in-console>
```
