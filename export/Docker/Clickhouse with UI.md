## .env
```env
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=4WF...Ad9
CLICKHOUSE_DB=main
```

## docker-compose.yml
```yml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    container_name: clickhouse
    restart: unless-stopped
    env_file: .env
    ports:
      - "8123:8123"
      - "9000:9000"
      - "9009:9009"
    volumes:
      - "./clickhouse:/var/lib/clickhouse"

  clickhouse-ui:
    image: ghcr.io/caioricciuti/ch-ui:latest
    container_name: clickhouse-ui
    restart: unless-stopped
    env_file: .env
    ports:
      - "5521:5521"
    environment:
      VITE_CLICKHOUSE_URL: "http://0.0.0.0:8123"
```
