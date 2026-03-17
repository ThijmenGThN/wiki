### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "2"
services:
  bookstack:
    image: lscr.io/linuxserver/bookstack
    container_name: bookstack
    environment:
      - PUID=1000
      - PGID=1000
      - APP_URL=https://wiki.thijmenheuvelink.nl
      - DB_HOST=bookstack_db
      - DB_USER=bookstack
      - DB_PASS=yourdbpass
      - DB_DATABASE=bookstackapp
    volumes:
      - /root/wiki:/cli/config
    ports:
      - 6875:80
    restart: unless-stopped
    depends_on:
      - bookstack_db
  bookstack_db:
    image: lscr.io/linuxserver/mariadb
    container_name: bookstack_db
    environment:
      - PUID=1000
      - PGID=1000
      - MYSQL_ROOT_PASSWORD=yourdbrootpass
      - TZ=Europe/London
      - MYSQL_DATABASE=bookstackapp
      - MYSQL_USER=bookstack
      - MYSQL_PASSWORD=yourdbpass
    volumes:
      - /root/wiki:/db/config
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```

### About this stack

Login with the following credentials, do mind to **change them** in settings afterwards to something secure!

|Username|Password|
|-|-|
|admin@admin.com|password|
