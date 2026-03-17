### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2.1"
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: vscode-server
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
      - PASSWORD=b00kst4ck
      - SUDO_PASSWORD=b00kst4ck #optional
      - PROXY_DOMAIN=vscode-server.my.domain #optional
      - DEFAULT_WORKSPACE=/config/workspace #optional
    volumes:
      - /home/$USER/env/vscode-server:/config
    ports:
      - 8443:8443
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```
