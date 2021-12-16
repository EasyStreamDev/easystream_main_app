// const { AllEvents, AllMics, Mic, Event } = require('./interfaces');

const { ipcRenderer } = require('electron');
const net = require('net');

class TCPConnection {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = net.connect(this.port, this.host, (test, error) => {
                console.log('test ->', test);
                console.log('error ->', error);
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
                this.socket.end();
                reject(error);
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
            callback(null, error)
        });
    };

    getAllMics() {
        let obj = {
            command: 'getAllMics',
            args: {}
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
                    ipcRenderer.send('close-me')
                    reject(error);
                }
            });
        });
    }

    setVolumeToMic(args) {
        let obj = {
            command: 'setVolumeToMic',
            args: {
                micId: args.micId,
                value: args.value
            }
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
                    reject(error);
                }
            });
        });
    }

    getMic(micId) {
        let obj = {
            command: 'getMic',
            args: {
                micId
            }
        };
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getMic resolve', data);
                    resolve(data);
                } else {
                    console.log('getMic error', error);
                    this.socket.end();
                    reject(error);
                }
            });
        });
    }

    getAllEvents() {
        let obj = {
            command: 'getAllEvents',
            args: {}
        };
        return new Promise((resolve, reject) => {
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getAllEvents resolve', data);
                    resolve(data);
                } else {
                    console.log('getAllEvents error', error);
                    this.socket.end();
                    reject(error);
                }
            });
        });
    }

    getEvent(eventId) {
        let obj = {
            command: 'getEvent',
            args: {
                eventId
            }
        };
        return new Promise((resolve, reject) => {
            console.log('getEvent emit');
            this.sendData(obj, (data, error) => {
                if (data) {
                    console.log('getEvent resolve', data);
                    resolve(data);
                } else {
                    console.log('getEvent error', error);
                    this.socket.end();
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
