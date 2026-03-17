### Run it with Docker

```
docker run \
	--name db \
	-v /root/env/db:/data/db \
	-p 12107:27017 \
	-e MONGO_INITDB_ROOT_USERNAME=<username> \
	-e MONGO_INITDB_ROOT_PASSWORD=<password> \
	--restart unless-stopped \
	-d mongo
```
