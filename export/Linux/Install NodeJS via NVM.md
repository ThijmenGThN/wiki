#### Tested on

- Ubuntu 22.04
- Ubuntu 20.04

> You can also install nvm on windows, there's an repository with an installer for it, [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) scroll down to assets.

### Install Node Version Manager
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

### Install any version of NodeJS
```
nvm install 20
```

### Start using a specific version
```
nvm use 20
```

#### Error: nvm: command not found
> This error is to be expected, you need to restart your session after NVM has been installed. Meaning you have to log out and back into your system.
