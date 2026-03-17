### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"

services:
  shlink:
    image: shlinkio/shlink:stable
    restart: unless-stopped
    container_name: shlink
    environment:
      - TZ="Europe/Amsterdam"
      - DEFAULT_DOMAIN=example.com
      - GEOLITE_LICENSE_KEY=<YOUR KEY>
      - DB_DRIVER=maria
      - DB_USER=shlink
      - DB_NAME=shlink
      - DB_PASSWORD=b00kst4ck
      - DB_HOST=database
    ports:
      - 8080:8080

  database:
    image: mariadb:latest
    restart: unless-stopped
    container_name: database
    environment:
      - MARIADB_ROOT_PASSWORD=b00kst4ck
      - MARIADB_DATABASE=shlink
      - MARIADB_USER=shlink
      - MARIADB_PASSWORD=b00kst4ck
    volumes:
      - ./env/database:/var/lib/mysql

  client:
    image: shlinkio/shlink-web-client
    restart: unless-stopped
    container_name: client
    volumes:
      - ./env/client/servers.json:/usr/share/nginx/html/servers.json
    ports:
      - 3000:80
```

### Starting it

```
docker-compose up -d
```

### About this stack

Generate an Access Token

```
docker exec -it shlink shlink api-key:generate
```
