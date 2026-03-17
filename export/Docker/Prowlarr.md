### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
    ports:
      - 9696:9696
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
