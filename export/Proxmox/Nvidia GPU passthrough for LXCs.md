## Guide for Nvidia GPU Integration

### System Specifications

```
Motherboard: Asrock B550M Pro4
CPU: Ryzen 5 5600G
RAM: 2x32GB 3200 DDR4
GPU: Nvidia 750 Ti (2GB)
```
```
Proxmox: 8.1.10
```

### Acknowledgements

This guide benefited from various sources, including:

- [Proxmox: PCI Passthrough](https://pve.proxmox.com/wiki/PCI_Passthrough)
- [Jim's Garage: vGPU for Intel based cards (YouTube)](https://www.youtube.com/watch?v=0ZDr5h52OOE)
- [Jim's Garage: Set of instructions (GitHub)](https://github.com/JamesTurland/JimsGarage/blob/main/LXC/Jellyfin/readme.md)

### Introduction

This comprehensive guide aims to streamline the integration process of Nvidia GPUs with Proxmox and LXC containers. It condenses knowledge from various sources into a practical, step-by-step format for ease of implementation.

### Installing Nvidia Drivers on the Proxmox Host

#### Download and Install Driver

1. Visit [Nvidia's Driver download page](https://www.nvidia.com/download/index.aspx) and select the appropriate driver for your GPU.
2. Copy the download link and execute the following commands:

    ```bash
    wget <YOUR_DRIVER_DOWNLOAD_LINK> -O driver.run
    chmod +x ./driver.run
    sudo ./driver.run
    ```

3. Follow on-screen prompts, selecting defaults as necessary. If prompted to overwrite X defaults, choose "yes."

#### Verification

Ensure the driver installation was successful by running:

```bash
nvidia-smi
```

The output should look similiar to this:

![Output of nvidia-smi](https://wiki.thijmenheuvelink.nl/pb/api/files/kblyx6ommv2lhn8/dwdjmzx3l6h3rnz/snipaste_2024_04_25_15_38_18_UTXbzrKR8a.png?token=)

### Making the GPU Available to LXC Containers on Proxmox (Host Configuration)

For a detailed understanding of device and group identification, refer to [Jim's video](https://www.youtube.com/watch?v=0ZDr5h52OOE).

#### Identify Device Numbers

```bash
ls -l /dev/dri
```

#### Identify Group Numbers

```bash
cat /etc/group
```

#### Update Subgid

Edit the subgid file:

```bash
nano /etc/subgid
```

Replace values with those obtained earlier.

#### Edit LXC Configuration

Edit the LXC configuration file:

```bash
nano /etc/pve/lxc/<lxc-id>.conf
```

Add the following lines:

```bash
lxc.cgroup2.devices.allow: c 226:0 rwm
lxc.cgroup2.devices.allow: c 226:128 rwm
lxc.mount.entry: /dev/dri/renderD128 dev/dri/renderD128 none bind,optional,create=file
lxc.idmap: u 0 100000 65536
lxc.idmap: g 0 100000 44
lxc.idmap: g 44 44 1
lxc.idmap: g 45 100045 62
lxc.idmap: g 107 104 1
lxc.idmap: g 108 100108 65428
lxc.mount.entry: /dev/nvidia0 dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm dev/nvidia-uvm none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-modeset dev/nvidia-modeset none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm-tools dev/nvidia-uvm-tools none bind,optional,create=file
```

#### Add Root to Groups

Grant root user access to necessary groups:

```bash
usermod -aG render,video root
```

### Setting up Your LXC

### System Specifications

```
OS: Ubuntu 22.04
```

#### Install Nvidia Docker Container Toolkit

Follow the installation guide [here](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#configuration), adapting steps as necessary.

#### Installing Nvidia Driver (LXC)

Ensure consistency of Nvidia driver versions between Proxmox host and LXC.

1. Download and install the driver:

    ```bash
    wget <YOUR_DRIVER_DOWNLOAD_LINK> -O driver.run
    chmod +x ./driver.run
    sudo ./driver.run --no-kernel-module
    ```

2. Follow prompts, using default settings. Use the flag "--no-kernel-module" to prevent kernel reinstallation.

#### Verification

Confirm driver installation within LXC:

```bash
nvidia-smi
```

The output should look similiar to this:

![Output of nvidia-smi](https://wiki.thijmenheuvelink.nl/pb/api/files/kblyx6ommv2lhn8/dwdjmzx3l6h3rnz/snipaste_2024_04_25_15_38_18_UTXbzrKR8a.png?token=)

## Conclusion

Your LXC container is now configured to utilize the Nvidia GPU effectively. For scaling to additional LXCs, repeat the configuration steps outlined above.

For further inquiries or assistance, feel free to reach out:

- Email: mail@thijmenheuvelink.nl
- Discord: thijmengthn
