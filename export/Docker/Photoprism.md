### Run it with Docker

```
docker run -d \
  --name fotos \
  --restart unless-stopped \
  --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined \
  -p 2342:2342 \
  -e PHOTOPRISM_UPLOAD_NSFW="true" \
  -e PHOTOPRISM_ADMIN_PASSWORD="admin" \
  -v /root/env:/photoprism/storage \
  photoprism/photoprism
```

### About this stack

The following credentials can be used to sign in, do mind to **change them** when you've got the chance!

|Username|Password|
|-|-|
|admin|admin|
