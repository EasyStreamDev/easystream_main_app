// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { TCPConnection, getAllMics, getMic, getAllEvents, getEvent, disconnectSocket } = require('../src/Socket/socket.js');
const { url } = require('inspector');

// let tcpConn = new TCPConnection('10.101.48.164', 47920);

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
	})
	
	// load the index.html of the app. (or localhost on port 3000 if you're in development)
	mainWindow.loadURL(url.format({
		pathname: isDev ? 'http://localhost:3000' : path.join(__dirname, '../build/index.html'),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.maximize();

	// ipcMain.handle('getAllMics', async (event, arg) => {
	// 	console.log('getAllMicsPLEASE');
	// 	return getAllMics(tcpConn.socket).then(res => {
	// 		console.log('getAllMics : ' + res);
	// 		return res;
	// 	});
	// });

	// ipcMain.handle('getMic', async (event, arg) => {
	// 	return getMic(tcpConn.socket, arg).then(res => {
	// 		console.log('getMic : ' + res);
	// 		return res;
	// 	});
	// });

	// ipcMain.handle('getAllEvents', async (event, arg) => {
	// 	return getAllEvents(tcpConn.socket).then(res => {
	// 		console.log('getAllEvents : ' + res);
	// 		return res;
	// 	});
	// });

	// ipcMain.handle('getEvent', async (event, arg) => {
	// 	return getEvent(tcpConn.socket, arg).then(res => {
	// 		console.log('getEvent : ' + res);
	// 		return res;
	// 	});
	// });

	// ipcMain.handle('disconnectSocket', async (event, arg) => {
	// 	return getAllMics(tcpConn.socket).then(res => {
	// 		console.log('getAllMics : ' + res);
	// 		return res;
	// 	});
	// });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	// if (tcpConn.socket != null && tcpConn.connecting) {
		createWindow()
		
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (BrowserWindow.getAllWindows().length === 0)
			createWindow()
		})
	// }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
	// disconnectSocket(tcpConn.socket);
	// tcpConn.socket.end();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use require('electron').remote
