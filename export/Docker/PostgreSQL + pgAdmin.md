### Docker Compose

Save the following contents as a docker-compose.yml file.

```
version: '3.8'
services:
  postgresql:
    container_name: postgresql
    image: postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: b00kst4ck
    ports:
      - "5432:5432"
    volumes:
      - /home/$USER/env/postgres:/var/lib/postgresql/data
  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@leaflet.app
      PGADMIN_DEFAULT_PASSWORD: b00kst4ck
    ports:
      - "5050:80"
```

### Starting it

```
docker-compose up -d
```
