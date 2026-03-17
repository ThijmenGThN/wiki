### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: "3"

services:

  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    restart: unless-stopped
    ports: [ "8090:8090" ]
    volumes:
      - pb_data:/pb_data
      # - ./types.d.ts:/pb_data/types.d.ts
      - ./migrations:/pb_migrations
      - ./hooks:/pb_hooks
      - ./public:/pb_public

volumes:
  pb_data:
```

### Starting it

```
docker-compose up -d
```
