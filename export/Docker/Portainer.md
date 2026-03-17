### Run it with Docker

```
docker run \
    -p 8000:8000 -p 9000:9443 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -d --name portainer --restart unless-stopped \
    portainer/portainer-ce:2.16.2
```

#### Running into issues?

Checkout the Catalogue on this wiki about Portainer not being accessible via Nginx Proxy Manager
