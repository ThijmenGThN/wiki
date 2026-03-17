### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3.6'

services:
  flame:
    image: pawelmalak/flame
    container_name: flame
    volumes:
      - /home/$USER/env/flame:/app/data
    ports:
      - 5005:5005
    environment:
      - PASSWORD=b00kst4ck
    restart: unless-stopped
```

### Starting it

```
docker-compose up -d
```
