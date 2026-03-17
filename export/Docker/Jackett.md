### Run it with Docker

```
docker run -d \
  --name=jackett \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/Amsterdam \
  -e AUTO_UPDATE=true \`#optional\` \
  -p 9117:9117 \
  -v /root/env/jackett/config:/config \
  -v /root/env/jackett/cache:/downloads \
  --restart unless-stopped \
  lscr.io/linuxserver/jackett:latest
```
