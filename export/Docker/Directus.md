### Run it with Docker

```
docker run -d \
  -e KEY=255d861b-5ea1-5996-9aa3-922530ec40b1 \
  -e SECRET=6116487b-cda1-52c2-b5b5-c8022c45e263 \
  --name directus \
  --restart unless-stopped \
  -p 8055:8055 \
  -e ADMIN_EMAIL="admin@example.com" \
  -e ADMIN_PASSWORD="b00kst4ck" \
  -v /root/env/directus/uploads:/directus/uploads \
  -v /root/env/directus/extensions:/directus/extensions \
  -v /root/env/directus/database:/directus/database \
  directus/directus
```
