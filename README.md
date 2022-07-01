# easystream_main_app

![Badge Web](https://img.shields.io/badge/Stack-Electron-cyan?logo=electron)
![Badge Web](https://img.shields.io/badge/Web-React-blue?logo=react)
![Badge Web](https://img.shields.io/badge/Back-Node-green?logo=node.js)

## Prerequisites :books:

**Yarn 1.0.0** or higher is required.

Installing dependencies with **yarn**.
```bash
yarn install
```

`.env` file in the root is required for development.
Here is an example of a `.env` file:
```bash
BROWSER=none # Do not open a browser window when running the app
```

On Ubuntu >= 20.04, install the following libraries:
```bash
sudo apt-get install build-essential clang libdbus-1-dev libgtk-3-dev \
                       libnotify-dev libasound2-dev libcap-dev \
                       libcups2-dev libxtst-dev \
                       libxss1 libnss3-dev gcc-multilib g++-multilib curl \
                       gperf bison python3-dbusmock openjdk-8-jre
```

On Ubuntu < 20.04, install the following libraries:
```bash
sudo apt-get install build-essential clang libdbus-1-dev libgtk-3-dev \
                       libnotify-dev libgnome-keyring-dev \
                       libasound2-dev libcap-dev libcups2-dev libxtst-dev \
                       libxss1 libnss3-dev gcc-multilib g++-multilib curl \
                       gperf bison python-dbusmock openjdk-8-jre
```

## Building and running the application :rocket:

Command to build and run the application in final mode:
```bash
yarn start
```

Command to build and run the application only the front:
```bash
yarn run front
```

# Build Linux / Windows / Mac

Just run the following commands
```bash
yarn run build
yarn run dist
```

[Linux instructions](https://www.electronjs.org/fr/docs/latest/development/build-instructions-linux)
[MacOs instructions](https://www.electronjs.org/fr/docs/latest/development/build-instructions-macos)
[Windows instructions](https://www.electronjs.org/fr/docs/latest/development/build-instructions-windows)

[Medium tutorial](https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3)
