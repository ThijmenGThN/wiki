### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  flaresolverr:
    image: flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    environment:
      - TZ=Europe/Amsterdam
    ports:
      - "8191:8191"
    restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
