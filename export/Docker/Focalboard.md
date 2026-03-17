### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"
services:
  focal:
    image: mattermost/focalboard
    container_name: focal
    ports: [ "3000:8000" ]
    restart: unless-stopped
    volumes:
      - ./config:/opt/focalboard/data
```

### Starting it

```
docker-compose up -d
```
