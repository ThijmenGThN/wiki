### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
      - ./data/movies:/movies
      - ./data/downloads:/downloads
    ports:
      - 7878:7878
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
