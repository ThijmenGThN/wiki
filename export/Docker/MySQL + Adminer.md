### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3.8"
services:
  mysql:
    image: mysql:latest
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: "b00kst4ck"
    ports:
      - 3306:3306
    volumes:
      - /home/$USER/env/mysql:/var/lib/mysql
  adminer:
    image: adminer:latest
    container_name: adminer
    links:
      - mysql
    environment:
      ADMINER_DEFAULT_SERVER: mysql
      ADMINER_DESIGN: pepa-linha-dark
    restart: unless-stopped
    ports:
      - 8080:8080
```

### Starting it

```
docker-compose up -d
```
