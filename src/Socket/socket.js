const net = require('net');

class TCPConnection {
    constructor(host, port, ipcMain) {
        this.host = host;
        this.port = port;
        this.socket = null;
        this.ipcMain = ipcMain
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = net.createConnection({ port: this.port, host: this.host }, () => {
                console.log('TCPConnection initialized');
                resolve(this.socket);
            });
            this.socket.once('data', (data) => {
                try {
                    data = data.toString().replace('\t', '').replace('\r', '').replace('\n', '').replace(/\0/g, ''); // Remove all useless characters
                    const payload = JSON.parse(data);
                    console.log(payload);
                } catch (error) {
                    console.error(error)
                }
            });
            this.socket.once('error', (error) => {
                console.log("TCP server error");
                this.socket.end();
                reject(error);
            });
            this.socket.once('close', (error) => {
                console.log("C'est CLOSE", error)
                if (!error) {
                    console.log('Server connection closed');
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(new Error("Server connection closed"));
                }
            });
        });
    }

    connectBroadcast() {
        return new Promise((resolve, reject) => {
            this.socket = net.createConnection({ port: this.port, host: this.host }, () => {
                console.log('TCPConnection broadcast initialized');
                this.setBrocast({ "enable": true }).then(
                    () => {
                        resolve(this.socket);
                    }
                )
            });
            this.socket.on('data', (data) => {
                try {
                    console.log("BEFORE toString", data)
                    data = data.toString()
                    data = data.replace('\t', '').replace('\r', '').replace(/\0/g, ''); // Remove all useless characters

                    // Split the data by newline character
                    const jsonStrings = data.split('\n');

                    // Add the JSON strings to the queue
                    jsonStrings.forEach((jsonString) => {
                        if (jsonString.trim() !== '') {

                            let payload = JSON.parse(jsonString);

                            if (payload.message === 'BROADCAST') {
                                let type = payload.data.type

                                if (type === 'audioSourceCreated' || type === 'audioSourceRemoved' || type === 'audioSourceNameChanged' || type === 'compressorSettingsChanged') {
                                    this.ipcMain.emit('compressor-level-updated')
                                } else if (type === 'sceneCreated' || type === 'sceneRemoved' || type === 'sceneNameChanged') {
                                    this.ipcMain.emit('scenes-updated')
                                } else if (type === "displaySourceCreated" || type === "displaySourceRemoved" || type === "displaySourceNameChanged") {
                                    this.ipcMain.emit('display-sources-updated')
                                } else if (type === 'areasChanged') {
                                    this.ipcMain.emit('actions-reactions-updated')
                                } else if (type === 'subtitlesSettingsChanged') {
                                    this.ipcMain.emit('subtitles-updated')
                                }
                            }
                        }
                    });

                } catch (error) {
                    console.error(error)
                }
            });
            this.socket.once('error', (error) => {
                console.log("TCP server error");
                this.socket.end();
                reject(error);
            });
            this.socket.once('close', (error) => {
                console.log("C'est CLOSE", error)
                if (!error) {
                    console.log('Server connection closed');
                    this.socket.end();
                }
            });
        });
    }

    disconnectSocket() {
        console.log('enterring disconnectSocket');
        if (this.socket && this.socket.connecting) {
            this.socket.end();
        }
    }

    sendData(obj, callback) {
        obj = JSON.stringify(obj) + "\r\n";
        this.socket.write(obj);
        this.socket.once('data', (data) => {
            try {
                data = data.toString().replace('\t', '').replace('\r', '').replace('\n', '').replace(/\0/g, ''); // Remove all useless characters
                const payload = JSON.parse(data);
                callback(payload, null);
            } catch (error) {
                callback(null, null);
            }
        });
        this.socket.on('error', (error) => {
            console.log(error)
            this.socket.end();
            this.ipcMain.emit('connection-server-lost')
            callback(null, error)
        });
    };

    getAllMics() {
        let obj = {
            command: '/microphones/get',
        };
        console.log('/microphones/get -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('/microphones/get resolve', data);
                    resolve(data);
                } else {
                    console.log('/microphones/get error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getAllScenes() {
        let obj = {
            command: '/scenes/get',
        };
        console.log('getAllScenes -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllScenes resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllScenes error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getActReactCouples() {
        let obj = {
            command: '/areas/get',
        };
        console.log('getActReactCouples -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getActReactCouples resolve', data);
                    resolve(data);
                } else {
                    console.log('getActReactCouples error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getSubtitlesSettings() {
        let obj = {
            command: '/subtitles/get',
        };
        console.log('getSubtitlesSettings -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getSubtitlesSettings resolve', data);
                    resolve(data);
                } else {
                    console.log('getSubtitlesSettings error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getAllTextFields() {
        let obj = {
            command: '/text-fields/get',
        };
        console.log('getAllTextFields -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllTextFields resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllTextFields error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getCurrentMicsTranscriptor() {
        let obj = {
            command: 'getCurrentMicsTranscriptor',
        };
        console.log('getCurrentMicsTranscriptor -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getCurrentMicsTranscriptor resolve', data);
                    resolve(data);
                } else {
                    console.log('getCurrentMicsTranscriptor error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getAllDisplaySources() {
        let obj = {
            command: '/display-sources/get',
        };
        console.log('getAllDisplaySources -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllDisplaySources resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllDisplaySources error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getAllLinksMicsToVideoSource() {
        let obj = {
            command: '/mtdsis/get',
        };
        console.log('getAllLinksMicsToVideoSource -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllLinksMicsToVideoSource resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllLinksMicsToVideoSource error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    setVolumeToMic(args) {
        let obj = {
            command: '/microphones/auto-leveler/set',
            params: args
        };
        console.log('/microphones/auto-leveler/set -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('/microphones/auto-leveler/set resolve', data);
                    resolve(data);
                } else {
                    console.log('/microphones/auto-leveler/set error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    removeMicVideoSource(args) {
        let obj = {
            command: '/mtdsis/remove',
            params: args
        };
        console.log('/mtdsis/remove -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('/mtdsis/remove resolve', data);
                    resolve(data);
                } else {
                    console.log('/mtdsis/remove error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    setSubtitles(args) {
        let obj = {
            command: '/subtitles/set',
            params: args
        };
        console.log('setSubtitles -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('setSubtitles resolve', data);
                    resolve(data);
                } else {
                    console.log('setSubtitles error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    setActionReaction(args) {
        let obj = {
            command: '/areas/create',
            params: args
        };
        console.log('setActionReaction -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('setActionReaction resolve', data);
                    resolve(data);
                } else {
                    console.log('setActionReaction error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    linkMicToVideoSource(args) {
        let obj = {
            command: '/mtdsis/create',
            params: args
        };
        console.log('linkMicToVideoSource -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('linkMicToVideoSource resolve', data);
                    resolve(data);
                } else {
                    console.log('linkMicToVideoSource error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    removeActReact(args) {
        let obj = {
            command: '/areas/remove',
            params: args
        };
        console.log('removeActReact -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('removeActReact resolve', data);
                    resolve(data);
                } else {
                    console.log('removeActReact error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    setBrocast(args) {
        let obj = {
            command: '/broadcast/subscribe',
            params: args
        };
        console.log('subscribeBroadcast -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('subscribeBroadcast resolve', data);
                    resolve(data);
                } else {
                    console.log('subscribeBroadcast error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

}

module.exports = {
    TCPConnection,
}
