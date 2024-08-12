import * as dgram from 'dgram';
import * as net from "net";
import HandleUDP from './udp';
import HandleTCP from './tcp';


let rooms: Map<string, string> = new Map<string, string>();
// map contains name of room as key, multicast ip as value.
// used to iterate over to send udp audio to each room

let users: Map<string, string> = new Map<string, string>();
// map with user's IP as key and group as value.
// used to grab user's group as audio data comes in.

export interface RoomContent {
  [room: string]: string[];
} // object with names of rooms as keys and arrays of users in them
// Used to send call info to each user over tcp, since needs to be in json

let userRooms: RoomContent = {"general": [] };
// will need to initialize from overhead server

let general: Set<string> = new Set();
// array of all users IP that are in general.

let udpVersion: dgram.SocketType = "udp4";
const server: dgram.Socket = dgram.createSocket(udpVersion);
HandleUDP(server, rooms, users, general); // get event handlers for UDP server

// NOTE:
// When setting up a server, will need to fetch prior room data for host.
// This will have to be stored on a server/cloud database on it's own.

let allSockets: net.Socket[] = [];
// store all connections of sockets.

const tcpServer: net.Server = net.createServer((socket: net.Socket) => {
  allSockets.push(socket); // each connection, push to array
  HandleTCP(socket, allSockets, rooms, userRooms, users, general); // set up handlers for each socket
});

tcpServer.listen(3001, () => {
  console.log('opened TCP server on', tcpServer.address());
}); 

server.bind(3000); // start UDP server


