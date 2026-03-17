### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3'
services:
    jellyseerr:
       image: fallenbagel/jellyseerr:latest
       container_name: jellyseerr
       environment:
            - TZ=Europe/Amsterdam
       ports:
            - 5055:5055
       volumes:
            - ./config:/app/config
       restart: unless-stopped
```

### Start it

```
docker-compose up -d
```
