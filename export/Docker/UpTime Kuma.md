### Run it with Docker

```
docker run -d \
    --restart=unless-stopped \
    -p 3001:3001 \
    -v /root/env/uptime-kuma:/app/data \
    --name uptime-kuma \
    louislam/uptime-kuma:1
```
