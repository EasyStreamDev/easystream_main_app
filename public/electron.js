// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
let notRelease = process.env.NOT_RELEASE || false;
const { TCPConnection } = require("../src/Socket/socket.js");
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
const localIpAddress = require("local-ip-address")

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

console.log("isDev", isDev)
console.log("notRelease", notRelease)

let loadingScreen;
let mainWindow;
let tcpConn;
let boadcastConn;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // turn this off if you don't mean to use node
      contextIsolation: false,
      enableRemoteModule: isDev,
    },
    autoHideMenuBar: true,
    title: "EasyStream",
    minWidth: 900,
    minHeight: 700,
    icon: __dirname + '/icon.png',
    /// show to false mean than the window will proceed with its lifecycle, but will not render until we will show it up
    show: false,
  });

  // https://github.com/electron-userland/electron-builder/issues/2404
  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  const startURL = isDev || notRelease
    ? "http://localhost:3000/app"
    : `file://${path.join(__dirname, '../build/index.html')}`; 
  

  mainWindow.loadURL(startURL)

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  /// keep listening on the did-finish-load event, when the mainWindow content has loaded
  mainWindow.webContents.on("did-finish-load", () => {
    /// then close the loading screen window and show the main window
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.maximize();
    mainWindow.show();
  });
};

ipcMain.on("getLocalIP", (event, _) => {
  event.returnValue = localIpAddress();
  return true;
});

ipcMain.on("getAllMics", (event, arg) => {
  if (isDev) {
    let res = {
      statusCode: 200,
      message: "OK",
      data: {
        length: 1,
        mics: [
          {
            micName: "Mic Test Dev",
            level: 30,
            isActive: true,
          },
        ],
      }
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.getAllMics().then((res) => {
      console.log("getAllMics : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("getAllScenes", (event, arg) => {
  if (isDev) {
    let res = {
      statusCode: 200,
      message: "OK",
      data: {
        length: 2,
        scenes: [
          {
            "name": "Scene 1",
            "uuid": "27705058-7a54-4057-ad17-a810c08e8db9",
          },
          {
            "name": "Scene 2",
            "uuid": "4f712d61-094a-4b7b-9905-4fa928329de4",
          }
        ],
      }
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.getAllScenes().then((res) => {
      console.log("getAllScenes : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("getActReactCouples", (event, arg) => {
  if (isDev) {
    let res = {
      statusCode: 200,
      message: "OK",
      data: {
        length: 1,
        actReacts: [
          {
            actReactId: 1,
            isActive: true,
            action: {
                actionId: 1,
                type: "WORD_DETECT",
                params: {
                  words: ['bouloubouga']
                }
            },
            reaction: {
                name: "Changement de scene sur la scene 2",
                reactionId: 1,
                type: "SCENE_SWITCH",
                params: {
                  scene: "Scene 2",
                  uuid: "4f712d61-094a-4b7b-9905-4fa928329de4"
                }
            }
          },
          { 
            actReactId: 2,
            isActive: true,
            action: {
                actionId: 2,
                type: "KEY_PRESSED",
                params: {
                  key: "m"
                }
            },
            reaction: {
                name: "Changement de scene sur la scene 3",
                reactionId: 4,
                type: "SCENE_SWITCH",
                params: {
                  scene: "Scene qui n'existe pas",
                  uuid: "2772a187-cc04-4058-9148-beaaba7a2145"
                }
            }
          },
        ],
      }
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.getActReactCouples().then((res) => {
      console.log("getActReactCouples : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("setCompressorLevel", (event, arg) => {
  if (isDev) {
    let res = {
      message: "OK",
      statusCode: 200,
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.setVolumeToMic(arg).then((res) => {
      console.log("setVolumeToMic : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("setSubtitles", (event, arg) => {
  if (isDev) {
    let res = {
      message: "OK",
      statusCode: 200,
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.setSubtitles(arg).then((res) => {
      console.log("setSubtitles : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("setActionReaction", (event, arg) => {
  if (isDev) {
    let res = {
      message: "OK",
      statusCode: 200,
      data: {
        actionId: 1,
        reactionId: 1,
        actReactId: 1,
      }
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.setActionReaction(arg).then((res) => {
      console.log("setActionReaction : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("removeActReact", (event, arg) => {
  if (isDev) {
    console.log("removeActReact")
    let res = {
      statusCode: 200,
      message: "OK",
      data: {
        actReactId: 1
      }
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.removeActReact(arg).then((res) => {
      console.log("removeActReact : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("compressor-level-updated", (evt, arg) => { // Get from socket broadcast
    mainWindow.webContents.send('compressor-level-updated'); // To renderer
});

ipcMain.on("scenes-updated", (evt, arg) => { // Get from socket broadcast
  mainWindow.webContents.send('scenes-updated'); // To renderer
});

ipcMain.on("actions-reactions-updated", (evt, arg) => { // Get from socket broadcast
  mainWindow.webContents.send('actions-reactions-updated'); // To renderer
});

ipcMain.on("subtitles-updated", (evt, arg) => { // Get from socket broadcast
  mainWindow.webContents.send('subtitles-updated'); // To renderer
});

ipcMain.on("connection-server-lost", (evt, arg) => {
  // Quit main app
  if (mainWindow)
    mainWindow.close();
  tcpConn = null;
  boadcastConn = null;

  // Load Loading page
  createLoadingScreen()
});

ipcMain.on("close-me", (evt, arg) => {
  app.quit();
});

const createLoadingScreen = () => {

  tcpConn = new TCPConnection("localhost", 47920, ipcMain);
  boadcastConn = new TCPConnection("localhost", 47920, ipcMain)
  // Try to connect every 5 seconds 
  let refreshIntervalId = setInterval(() => {

    tcpConn
      .connect()
      .then((res) => {
        clearInterval(refreshIntervalId);
        boadcastConn.connectBroadcast()
        .then((broadcast_res) => {
          console.log("TCPConnection and Broadcast is connected");
          launchingApplication();
          clearInterval(refreshIntervalId);
          return res;
        }).catch((err) => {
          tcpConn.disconnectSocket()
          if (isDev) {
            console.log("DEV MODE");
            clearInterval(refreshIntervalId);
            return null;
          } else {
            console.log("Can't locate the server", err);
            setInterval(refreshIntervalId, 5000)
            return null;
          }
        })
      }).catch((err) => {
        if (isDev) {
          console.log("DEV MODE");
          clearInterval(refreshIntervalId);
          return null;
        } else {
          console.log("Can't locate the server", err);
          return null;
        }
      });

  }, 3000);

  if (!loadingScreen) {
    /// create a browser window
    loadingScreen = new BrowserWindow(
      Object.assign({
        /// define width and height for the window
        width: 440,
        height: 260,
        title: "EasyStream",
        icon: __dirname + '/icon.png',
        /// remove the window frame, so it will become a frameless window
        frame: false,
        /// and set the transparency, to remove any window background color
        transparent: true,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: isDev,
          contextIsolation: false,
        },
      }),
    );
    loadingScreen.setResizable(false);
    loadingScreen.loadURL(`file://${path.join(__dirname, "./loading.html")}`);
    loadingScreen.on("closed", () => (loadingScreen = null));
    loadingScreen.webContents.on("did-finish-load", () => {
      loadingScreen.show();
    });
  }
};

const launchingApplication = () => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

function sendStatusToWindow(text) {
  log.info(text);
  if (loadingScreen)
    loadingScreen.webContents.send('message', text);
  if (mainWindow)
    mainWindow.webContents.send('message', text);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  if (isDev) {
    launchingApplication();
  } else {
    createLoadingScreen();
  }

  // // Updater
  // autoUpdater.on('checking-for-update', () => {
  //   sendStatusToWindow('Checking for update...');
  // })
  // autoUpdater.on('update-available', (info) => {
  //   sendStatusToWindow('Update available.');
  // })
  // autoUpdater.on('update-not-available', (info) => {
  //   sendStatusToWindow('Update not available.');
  // })
  // autoUpdater.on('error', (err) => {
  //   sendStatusToWindow('Error in auto-updater. ' + err);
  // })
  // autoUpdater.on('download-progress', (progressObj) => {
  //   let log_message = "Download speed: " + progressObj.bytesPerSecond;
  //   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  //   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  //   sendStatusToWindow(log_message);
  // })
  // autoUpdater.on('update-downloaded', (info) => {
  //   sendStatusToWindow('Update downloaded');
  // });

  // The simplest version
  autoUpdater.checkForUpdatesAndNotify();

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  tcpConn.disconnectSocket();
  boadcastConn.disconnectSocket();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use require('electron').remote
