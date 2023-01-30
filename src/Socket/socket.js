// const { AllEvents, AllMics, Mic, Event } = require('./interfaces');

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
                setTimeout(() => {
                    resolve(this.socket);
                }, 3000);
            });
            this.socket.once('data', function (data) {
                data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
                const payload = JSON.parse(data);
                console.log(payload);
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

    disconnectSocket() {
        console.log('enterring disconnectSocket');
        if (this.socket && this.socket.connecting) {
            this.socket.end();
        }
    }

    sendData(obj, callback){
        obj = JSON.stringify(obj);
        this.socket.write(obj);
        this.socket.once('data', (data) => {
            data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
            const payload = JSON.parse(data);
            callback(payload, null)
        });
        this.socket.on('error', (error) => {
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
            command: 'setMicLevel',
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
                    this.ipcMain.emit('connection-server-lost')
                    this.socket.end();
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

    setAutoAudioLeveler(args) {
        let obj = {
            command: 'setAutoAudioLeveler',
            params: args
        };
        console.log('setAutoAudioLeveler -> ', JSON.stringify(obj));
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('setAutoAudioLeveler resolve', data);
                    resolve(data);
                } else {
                    console.log('setAutoAudioLeveler error', error);
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

}

// function TCPConnection(host, port) {
//     EventEmitter.call(this);

//     return new Promise((resolve, reject) => {
//         try {
//             this.socket = net.connect(port, host, (test, error) => {
//                 console.log('test ->', test);
//                 console.log('error ->', error);
//                 console.log('TCPConnection initialized');
//                 setTimeout(() => {
//                     resolve(this.socket);
//                 }, 3000);
//             });
//             this.socket.once('data', function (data) {
//                 data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
//                 const payload = JSON.parse(data);
//                 console.log(payload);
//             });
//             this.socket.once('error', (error) => {
//                 reject(error);
//                 this.socket.end();
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// util.inherits(TCPConnection, EventEmitter);

// function sendData(socket, obj, callback){
//     obj = JSON.stringify(obj);
//     socket.write(obj);
//     socket.once('data', (data) => {
//         data = data.toString().replace('\t','').replace('\r','').replace('\n','').replace(/\0/g, ''); // Remove all useless characters
//         callback(data, null)
//     });
//     socket.on('error', (error) => {
//         callback(null, error)
//     });
// };

// Get All Mics
// function getAllMics(socket) {
//     let obj = {
//         command: 'getAllMics',
//         args: []
//     };
//     console.log('obj done');
//     return new Promise((resolve, reject) => {
//         sendData(socket, obj, (data, error) => {
//             if (data) {
//                 console.log('getAllMics resolve', data);
//                 resolve(data);
//             } else {
//                 console.log('getAllMics error', error);
//                 socket.end();
//                 reject(error);
//             }
//         });
//     });
// }

// Get Mic
// function getMic(socket, name) {
//     let obj = {
//         command: 'getMic',
//         args: [name]
//     };
//     return new Promise((resolve, reject) => {
//         sendData(socket, obj, (data, error) => {
//             if (data) {
//                 console.log('getMic resolve', data);
//                 resolve(data);
//             } else {
//                 console.log('getMic error', error);
//                 socket.end();
//                 reject(error);
//             }
//         });
//     });
// }

// Get All Events
// function getAllEvents(socket) {
//     let obj = {
//         command: 'getAllEvents',
//         args: []
//     };
//     return new Promise((resolve, reject) => {
//         sendData(socket, obj, (data, error) => {
//             if (data) {
//                 console.log('getAllEvents resolve', data);
//                 resolve(data);
//             } else {
//                 console.log('getAllEvents error', error);
//                 socket.end();
//                 reject(error);
//             }
//         });
//     });
// }

// Get Event
// function getEvent(socket, id) {
//     let obj = {
//         command: 'getEvent',
//         args: [id]
//     };
//     return new Promise((resolve, reject) => {
//         console.log('getEvent emit');
//         sendData(socket, obj, (data, error) => {
//             if (data) {
//                 console.log('getEvent resolve', data);
//                 resolve(data);
//             } else {
//                 console.log('getEvent error', error);
//                 socket.end();
//                 reject(error);
//             }
//         });
//     });
// }

// function disconnectSocket(socket) {
//     console.log('enterring disconnectSocket');
//     if (socket && socket.connecting) {
//         socket.end();
//     }
// }

module.exports = {
    TCPConnection,
}
