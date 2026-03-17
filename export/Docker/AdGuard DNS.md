### via Docker Compose

```
services:
  adguard:
    image: adguard/adguardhome
    container_name: adguard
    restart: unless-stopped
    volumes:
      - ./data/workdir:/opt/adguardhome/work
      - ./data/confdir:/opt/adguardhome/conf
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp"
      - "68:68/udp"
      - "80:80/tcp"
      - "443:443/tcp"
      - "443:443/udp"
      - "3000:3000/tcp"
      - "853:853/tcp"
      - "784:784/udp"
      - "853:853/udp"
      - "8853:8853/udp"
      - "5443:5443/tcp"
      - "5443:5443/udp"
```

### Launching AdGuard

1. Save the above content as docker-compose.yml in your desired directory.
2. Navigate to the directory in your terminal.
3. Run the following command to start the container:

```
docker-compose up -d
```

The service will now be running in detached mode. You can access the AdGuard Home web interface using the IP address of your host machine on port 3000.
