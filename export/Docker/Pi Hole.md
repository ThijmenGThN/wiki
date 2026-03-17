### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"

services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp"
      - "80:80/tcp"
    environment:
      TZ: 'Europe/Amsterdam'
      WEBPASSWORD: 'b00kst4ck'
    volumes:
      - './etc-pihole:/etc/pihole'
      - './etc-dnsmasq.d:/etc/dnsmasq.d'
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```

### OR install it without Docker

```
curl -sSL https://install.pi-hole.net | bash
```
