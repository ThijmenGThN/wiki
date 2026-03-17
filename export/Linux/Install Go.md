# Go 1.23.5 Installation Script

### Using Bash?

This script automates the installation of Go 1.23.5 on Linux by performing the following steps:

- **Download:** Retrieves Go 1.23.5 from [https://go.dev/dl/go1.23.5.linux-amd64.tar.gz](https://go.dev/dl/go1.23.5.linux-amd64.tar.gz).
- **Remove:** Deletes any existing Go installation at `/usr/local/go`.
- **Extract:** Unpacks the downloaded tarball into `/usr/local`.
- **Update PATH:** Appends `/usr/local/go/bin` to your PATH in `~/.profile` and reloads the profile, making the `go` command immediately available in your terminal.

```
wget -q https://go.dev/dl/go1.23.5.linux-amd64.tar.gz && sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.5.linux-amd64.tar.gz && echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile && source ~/.profile
```

### Using Zsh?
This script automates the installation of Go 1.23.5 on Linux by performing the following steps:
- **Download:** Retrieves Go 1.23.5 from [https://go.dev/dl/go1.23.5.linux-amd64.tar.gz](https://go.dev/dl/go1.23.5.linux-amd64.tar.gz).
- **Remove:** Deletes any existing Go installation at `/usr/local/go`.
- **Extract:** Unpacks the downloaded tarball into `/usr/local`.
- **Update PATH:** Appends `/usr/local/go/bin` to your PATH in `~/.zshrc` and reloads the config, making the `go` command immediately available in your terminal.
```
wget -q https://go.dev/dl/go1.23.5.linux-amd64.tar.gz && sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.5.linux-amd64.tar.gz && echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.zshrc && source ~/.zshrc
```
