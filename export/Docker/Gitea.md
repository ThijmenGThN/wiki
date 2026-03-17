### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:1.16.9
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: unless-stopped
    networks:
      - gitea
    volumes:
      - /root/env/gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
```

### Starting it

```
docker-compose up -d
```
