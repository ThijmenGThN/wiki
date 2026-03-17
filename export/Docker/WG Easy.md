# Install WG-Easy

## 1. Generate a hash for your password

```
docker run -it ghcr.io/wg-easy/wg-easy wgpw YOUR_PASSWORD
```

## 2. Copy the generated hash, use it in the compose file

> Remove the single quotes and insert an extra $ before each existing $

```
services:
  wireguard:
    image: ghcr.io/wg-easy/wg-easy
    container_name: wireguard
    environment:
      WG_HOST: "ext.heuve.link"
      PASSWORD_HASH: "<Your Generated Hash>"
      WG_DEFAULT_DNS: 1.1.1.1
    volumes:
      - ./data:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      net.ipv4.conf.all.src_valid_mark: "1"
      net.ipv4.ip_forward: "1"
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```

#### Preview

![Preview](https://wiki.thijmenheuvelink.nl/pb/api/files/kblyx6ommv2lhn8/vekg3an1er8tip8/image_2023_12_17_013354729_3NYLAwTxks.png?token=)
