1. Create the database file:
```
touch filebrowser.db
```

2. Create a docker-compose file:
```
services:
  filebrowser:
    image: filebrowser/filebrowser
    container_name: filebrowser
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./data:/srv
      - ./branding:/branding
      - ./filebrowser.db:/database.db
```

3. Run Docker Compose:
```
docker-compose up -d
```

4. Visit the web ui and login

Go to http://localhost:8080 and login with user: admin, pass: admin.
