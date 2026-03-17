### Docker Compose

Save the following contents as a docker-compose.yml file.

```
services:
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: npm
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    volumes:
      - ./data/npm:/data
      - ./data/letsencrypt:/etc/letsencrypt
```

### Starting it

```
docker-compose up -d
```

### Logging in (default credentials)

> Email: admin@example.com
> Pass: changeme
