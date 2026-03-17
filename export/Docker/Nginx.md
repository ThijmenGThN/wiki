### Run it with Docker

```
docker run \
	--restart unless-stopped \
	--name nginx \
	-d -p 8080:80 \
	-v /home/$USER/env/nginx:/usr/share/nginx/html:ro \
	nginx
```

### Run it with Docker Compose
```
services:
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: unless-stopped
    ports: [ "80:80" ]
    volumes:
      - ./www:/usr/share/nginx/html:ro
```
