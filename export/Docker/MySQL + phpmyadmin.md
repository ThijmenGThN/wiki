### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3'

services:
  mysql:
    image: mysql:latest
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: b00kst4ck
    ports:
      - "3306:3306"
    volumes:
      - /home/$USER/mysql:/var/lib/mysql
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin
    links:
      - mysql
    environment:
      PMA_ARBITRARY: 1
      PMA_HOST: mysql
      PMA_PORT: 3306
    restart: unless-stopped
    ports:
      - 80:80
    volumes:
      - /home/$USER/theme:/var/www/html/themes/custom
```

### Starting it

```
docker-compose up -d
```
