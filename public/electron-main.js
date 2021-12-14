// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { TCPConnection } = require('../src/Socket/socket.js');

let loadingScreen;
let tcpConn = new TCPConnection('10.101.48.164', 47920);
tcpConn.connect()
.then((res) => {
	console.log('TCPConnection is connected');
	launchingApplication();
	console.log('res', res);
	return res;
}).catch(err => {
	console.log('Error Electron', err);
	return null;
});


const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true, // turn this off if you don't mean to use node
			enableRemoteModule: true, // turn this off if you don't mean to use remote module
			contextIsolation: false
		},
		autoHideMenuBar: true,
		minWidth: 800,
		minHeight: 600,
		/// show to false mean than the window will proceed with its lifecycle, but will not render until we will show it up
		show: false
	})
	
	// load the index.html of the app. (or localhost on port 3000 if you're in development)
	mainWindow.loadURL(
		isDev
		? 'http://localhost:3000'
		: `file://${path.join(__dirname, '../build/index.html')}`
	)

	/// keep listening on the did-finish-load event, when the mainWindow content has loaded
	mainWindow.webContents.on('did-finish-load', () => {
		/// then close the loading screen window and show the main window
		if (loadingScreen) {
			loadingScreen.close();
		}
		mainWindow.maximize();
		mainWindow.show();
	});
	
}

ipcMain.on('getAllMics', (event, arg) => {
	console.log('getAllMicsPLEASE');
	return tcpConn.getAllMics().then(res => {
		console.log('getAllMics : ' + res);
		return res;
	});
});

ipcMain.on('getMic', (event, arg) => {
	return tcpConn.getMic(arg).then(res => {
		console.log('getMic : ' + res);
		return res;
	});
});

ipcMain.on('getAllEvents', (event, arg) => {
	return tcpConn.getAllEvents().then(res => {
		console.log('getAllEvents : ' + res);
		return res;
	});
});

ipcMain.on('getEvent', (event, arg) => {
	return tcpConn.getEvent(arg).then(res => {
		console.log('getEvent : ' + res);
		return res;
	});
});

ipcMain.on('disconnectSocket', (event, arg) => {
	return tcpConn.getAllMics().then(res => {
		console.log('getAllMics : ' + res);
		return res;
	});
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
		nodeIntegration: true
	  }
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(`file://${path.join(__dirname, './loading.html')}`);
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};

const launchingApplication = () => {
	createWindow();
	
	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0)
		createWindow()
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createLoadingScreen();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
	tcpConn.disconnectSocket();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use require('electron').remote
