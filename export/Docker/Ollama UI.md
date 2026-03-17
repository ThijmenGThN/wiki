```yml
services:
  ollama-engine:
    image: ollama/ollama:latest
    container_name: ollama-engine
    restart: unless-stopped
    ports: ["11434:11434"]
    volumes:
      - ./ollama/engine:/root/.ollama
    # OPTIONAL: Nvidia GPU Support for faster generation.
    # environment:
    #   - gpus=all
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #       - driver: nvidia
    #         capabilities: [gpu]

  ollama-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: ollama-webui
    restart: unless-stopped
    ports: ["8080:8080"]
    environment:
      - OLLAMA_BASE_URL=http://ollama-engine:11434
    volumes:
      - ./ollama/webui:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    depends_on:
      - ollama-engine
```
