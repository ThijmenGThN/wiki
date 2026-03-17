### Run it with Docker

```
docker run -d \
  --name=wiki \
  --restart unless-stopped \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/Amsterdam \
  -p 8080:3000 \
  -v /root/env/wiki/config:/config \
  -v /root/env/wiki/data:/data \
  --restart unless-stopped \
  lscr.io/linuxserver/wikijs:latest
```
