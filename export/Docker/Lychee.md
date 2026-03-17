### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"
services:
  mariadb:
    image: lscr.io/linuxserver/mariadb:latest
    container_name: lychee-db
    restart: unless-stopped
    volumes:
      - /root/env/fotos/db:/config
    environment:
      - MYSQL_ROOT_PASSWORD=wikirootpassword
      - MYSQL_DATABASE=lychee
      - MYSQL_USER=lychee
      - MYSQL_PASSWORD=wikipassword
      - PGID=1000
      - PUID=1000
      - TZ=Europe/Amsterdam
  lychee:
    image: lscr.io/linuxserver/lychee:latest
    container_name: lychee
    restart: unless-stopped
    depends_on:
      - mariadb
    volumes:
      - /root/env/fotos/config:/config
      - /root/env/fotos/gallery:/pictures
    environment:
      - DB_HOST=mariadb
      - DB_USERNAME=lychee
      - DB_PASSWORD=wikipassword
      - DB_DATABASE=lychee
      - DB_PORT=3306
      - PGID=1000
      - PUID=1000
      - TZ=Europe/Amsterdam
    ports:
      - 3001:80
```

### Starting it

```
docker-compose up -d
```
