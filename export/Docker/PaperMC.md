```
services:
  minecraft:
    image: 'ghcr.io/thijmengthn/papermc:latest'
    container_name: minecraft
    restart: unless-stopped
    user: 1000:1000
    ports:
      - 25565:25565
    volumes:
      - ./data:/papermc
    environment:
      - EULA=true
      - MC_VERSION=1.21
      - MC_RAM=2G
      - JAVA_OPTS=-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1
```
