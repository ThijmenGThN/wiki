### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
      - ./data/series:/series
      - ./data/downloads:/downloads
    ports:
      - 8989:8989
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
