```
services:
  cloud:
    image: lscr.io/linuxserver/nextcloud:latest
    container_name: cloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Amsterdam
    volumes:
      - ./config:/config
      - ./data:/data
    ports:
      - 443:443
    restart: unless-stopped

  database:
    container_name: database
    environment:
      - PUID=1000
      - PGID=1000
      - MYSQL_ROOT_PASSWORD=admin
      - TZ=Europe/Amsterdam
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=admin
    volumes:
      - ./database:/config
    restart: always
    image: lscr.io/linuxserver/mariadb:latest
```
