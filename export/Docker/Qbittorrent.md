### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
      - WEBUI_PORT=8080
    volumes:
      - /home/$USER/env/config:/config
      - /home/$USER/env/downloads:/downloads
    ports:
      - 8080:8080
      - 6881:6881
      - 6881:6881/udp
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```

### Default credentials

|Username|Password|
|-|-|
|admin|adminadmin|
