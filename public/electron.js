// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { TCPConnection } = require("../src/Socket/socket.js");

let loadingScreen;
let mainWindow;
let tcpConn = new TCPConnection("localhost", 47920);
tcpConn
  .connect()
  .then((res) => {
    console.log("TCPConnection is connected");
    launchingApplication();
    console.log("res", res);
    return res;
  })
  .catch((err) => {
    if (isDev) {
      console.log("DEV MODE");
      return null;
    } else {
      console.log("Error Electron", err);
      console.log("CHANGE HOST IP");
      return null;
    }
  });

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // turn this off if you don't mean to use node
      contextIsolation: false,
      enableRemoteModule: isDev,
    },
    autoHideMenuBar: true,
    minWidth: 800,
    minHeight: 600,
    /// show to false mean than the window will proceed with its lifecycle, but will not render until we will show it up
    show: false,
  });

  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  mainWindow.loadURL("http://localhost:3000");

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

ipcMain.on("getAllMics", (event, arg) => {
  if (isDev) {
    let res = {
      statusCode: 200,
      message: "OK",
      length: 1,
      mics: [
        {
          name: "Mic Test Dev",
          level: 30,
          isActive: true,
        },
      ],
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

ipcMain.on("setMicLevel", (event, arg) => {
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

ipcMain.on("setAutoAudioLeveler", (event, arg) => {
  if (isDev) {
    let res = {
      message: "OK",
      statusCode: 200,
    };
    event.returnValue = res;
    return res;
  } else {
    return tcpConn.setAutoAudioLeveler(arg).then((res) => {
      console.log("setAutoAudioLeveler : " + res);
      event.returnValue = res;
    });
  }
});

ipcMain.on("disconnectSocket", (event, arg) => {
  return tcpConn.getAllMics().then((res) => {
    console.log("disconnectSocket : " + res);
    event.returnValue = res;
  });
});

ipcMain.on("close-me", (evt, arg) => {
  app.quit();
});

const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 300,
      height: 400,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: isDev,
        contextIsolation: false,
      },
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(`file://${path.join(__dirname, "./loading.html")}`);
  loadingScreen.on("closed", () => (loadingScreen = null));
  loadingScreen.webContents.on("did-finish-load", () => {
    loadingScreen.show();
  });
};

const launchingApplication = () => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  if (isDev) {
    launchingApplication();
  } else {
    createLoadingScreen();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  tcpConn.disconnectSocket();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use require('electron').remote
