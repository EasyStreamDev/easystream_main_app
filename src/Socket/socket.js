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
            this.socket = net.createConnection({port: this.port, host: this.host}, () => {
                console.log('TCPConnection initialized');
                resolve(this.socket);
            });
            this.socket.once('data', (data) => {
                try {
                    data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
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
            this.socket = net.createConnection({port: this.port, host: this.host}, () => {
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
                    console.log("AFTER toString", data)
                    data = data.replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
                    console.log("AFTER purge", data)

                    const payload = JSON.parse(data);
                    console.log("AFTER JSON parse", data)

                    if (payload.message === 'BROADCAST') {
                        let type = payload.data.type

                        if (type === 'audioSourceCreated' || type === 'audioSourceRemoved' || type === 'audioSourceNameChanged' || type === 'micLevelChanged') {
                            this.ipcMain.emit('compressor-level-updated')
                        } else if (type === 'sceneCreated' || type === 'sceneRemoved' || type === 'sceneNameChanged') {
                            this.ipcMain.emit('scenes-updated')
                        }
                    }
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

    sendData(obj, callback){
        obj = JSON.stringify(obj) + "\r\n";
        this.socket.write(obj);
        this.socket.once('data', (data) => {
            try {
                data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
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
            command: 'getAllMics',
        };
        console.log('getAllMics -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllMics resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllMics error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    getActReactCouples() {
        let obj = {
            command: 'getActReactCouples',
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

    setVolumeToMic(args) {
        let obj = {
            command: 'setCompressorLevel',
            params: args
        };
        console.log('setVolumeToMic -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('setVolumeToMic resolve', data);
                    resolve(data);
                } else {
                    console.log('setVolumeToMic error', error);
                    this.socket.end();
                    this.ipcMain.emit('connection-server-lost')
                    reject(error);
                }
            });
        });
    }

    setSubtitles(args) {
        let obj = {
            command: 'setSubtitles',
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
            command: 'setActionReaction',
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

    removeActReact(args) {
        let obj = {
            command: 'removeActReact',
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
            command: 'subscribeBroadcast',
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
