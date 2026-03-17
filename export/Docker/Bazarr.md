### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
      - ./data/movies:/movies
      - ./data/series:/tv
    ports:
      - 6767:6767
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
