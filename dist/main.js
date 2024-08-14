"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = __importStar(require("dgram"));
const net = __importStar(require("net"));
const udp_1 = __importDefault(require("./udp"));
const tcp_1 = __importDefault(require("./tcp"));
let rooms = new Map();
// map contains name of room as key, multicast ip as value.
// used to iterate over to send udp audio to each room.
let multicastIPs = new Set();
// set of all multicast ips currently in use.
// using Administratively scoped scoped addresses, 239.0.0.0 to 239.255.255.255.
let users = new Map();
// Used to send call info to each user over tcp, since needs to be in json
let userRooms = { "general": [] };
// will need to initialize from overhead server
let general = new Set();
// array of all users IP that are in general.
let udpVersion = "udp4";
const server = dgram.createSocket(udpVersion);
(0, udp_1.default)(server, rooms, users, general); // get event handlers for UDP server
// NOTE:
// When setting up a server, will need to fetch prior room data for host.
// This will have to be stored on a server/cloud database on it's own.
let allSockets = [];
// store all connections of sockets.
const tcpServer = net.createServer((socket) => {
    allSockets.push(socket); // each connection, push to array
    (0, tcp_1.default)(socket, allSockets, rooms, userRooms, users, general, multicastIPs); // set up handlers for each socket
});
tcpServer.listen(3001, '0.0.0.0', () => {
    console.log('opened TCP server on', tcpServer.address());
});
server.bind(3000); // start UDP server
