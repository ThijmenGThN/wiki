### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    volumes: [/home/$USER/env/:/data/]
    ports: [8080:80]
```

### Starting it

```
docker-compose up -d
```
