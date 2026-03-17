### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3'
services:
  osticket:
    image: devinsolutions/osticket:latest
    container_name: osticket
    restart: unless-stopped
    ports: [ "80:80" ]
    environment:
      MYSQL_USER: osticket
      MYSQL_PASSWORD: b00kst4ck
      MYSQL_HOST: database
      MYSQL_DATABASE: osticket
  database:
    image: mysql:5.7
    container_name: database
    restart: unless-stopped
    environment:
      MYSQL_USER: osticket
      MYSQL_PASSWORD: b00kst4ck
      MYSQL_ROOT_PASSWORD: b00kst4ck
      MYSQL_DATABASE: osticket
```

### Starting it

```
docker-compose up -d
```
