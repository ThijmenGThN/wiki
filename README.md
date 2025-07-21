
# Wiki

An open-source wiki built ontop of [Payload](https://payloadcms.com), easily deploy this yourself via the instructions below.

> **Demo** - Interested to see it in action? Visit [wiki.thijmenheuvelink.nl](https://wiki.thijmenheuvelink.nl) for a live demo.

<p align="center">
  <img src="https://i.imgur.com/MuuSWcV.png">
</p>



#### ⭐ Show Your Support for Open Source!

If this Wiki has been helpful to you and you appreciate the power of open-source software, please consider giving this repository a star.

[![Stargazers](https://reporoster.com/stars/dark/notext/ThijmenGThN/wiki)](https://github.com/ThijmenGThN/wiki/stargazers)



## Features

- **Creating pages and categories**

    Easily organize your content by adding pages within specific categories. This helps in maintaining a structured and easy-to-navigate wiki.

- **Admin Interface**

    Manage your entire wiki through a user-friendly admin interface. This includes creating, editing, and deleting pages, as well as organizing them into categories.

- **Whitelabeling**

    Customize the appearance of your wiki. The admin interface allows you to change the site name, set an about message, and disclaimer.



## Getting Started

### Prerequisites 

Docker and it's compose plugin are required, below is a matrix on how to install both for your system:

|Operating System|Official Instructions|
|-|-|
|Linux|[docs.docker.com/../linux-install](https://docs.docker.com/desktop/install/linux-install/)
|MacOS|[docs.docker.com/.../mac-install](https://docs.docker.com/desktop/install/mac-install/)
|Windows|[docs.docker.com/.../windows-install](https://docs.docker.com/desktop/install/windows-install/)

### Creating the compose file

Create a `docker-compose.yml` file in your project directory with the following content:

```yaml
services:
  wiki:
    container_name: wiki
    image: ghcr.io/thijmengthn/wiki:latest
    restart: unless-stopped
    volumes: ["./database:/app/database"]
    ports: ["3000:3000"]
    environment:
      - PAYLOAD_SECRET=your_secret_key_here
```

Replace `your_secret_key_here` with a secure secret key of your choice.

### Starting the Wiki

Run the following command to start the service:

```sh
docker compose up -d
```

You can now access the wiki by navigating to [localhost:3000](http://localhost:3000) in your browser.



## ✨ A wiki for everyone!

Whether you need help, want to pitch in, or found a bug that needs fixing, just [open an issue](https://github.com/ThijmenGThN/swaparr/issues). We're all ears and ready to collaborate with you!
