### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3.3"

services:
  db:
    image: mysql:5.7
    volumes:
      - /root/env/wp/db:/var/lib/mysql
    restart: unless-stopped
    environment:
      MYSQL_USER: wp
      MYSQL_DATABASE: wp
      MYSQL_ROOT_PASSWORD: b00kst4ck
      MYSQL_PASSWORD: b00kst4ck

  app:
    depends_on:
      - db
    image: wordpress:latest
    volumes:
      - /root/env/wp/www:/var/www/html
    ports:
      - 8080:80
    restart: unless-stopped
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_NAME: wp
      WORDPRESS_DB_PASSWORD: b00kst4ck
```

### Starting it

```
docker-compose up -d
```

### Running it through Cloudflare

If You're routing wordpress through Cloudflare behind a reverse proxy like **Nginx Proxy Manager** then you must install a plugin on wordpress called "**Flexible SSL for CloudFlare**".
