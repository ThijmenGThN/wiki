```
services:
  share:
    image: ghcr.io/stonith404/pingvin-share:v1.8.2
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      - TRUST_PROXY=true
    volumes:
      - "./share/data:/opt/app/backend/data"
      - "./share/images:/opt/app/frontend/public/img"
```
