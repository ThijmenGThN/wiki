### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
      - ./data/movies:/data/media/movies
      - ./data/series:/data/media/series
    ports:
      - 8096:8096
      - 8920:8920
      - 7359:7359/udp
      - 1900:1900/udp
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
