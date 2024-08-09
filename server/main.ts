import * as dgram from 'dgram';
import * as net from "net";
import SetUpUDP from './udp';
import HandleTCP from './tcp';


let rooms: Map<string, string> = new Map<string, string>();
// map contains name of room as key, multicast ip as value.
// used to iterate over to send udp audio to each room

export interface RoomContent {
  [room: string]: string[];
} // object with names of rooms as keys and arrays of users in them
// Used to send call info to each user over tcp

let userRooms: RoomContent = {"general": [] };
// will need to initialize from overhead server


let udpVersion: dgram.SocketType = "udp4";
const server: dgram.Socket = dgram.createSocket(udpVersion);
SetUpUDP(server); // get event handlers for UDP server

// NOTE:
// When setting up a server, will need to fetch prior room data for host.
// This will have to be stored on a server/cloud database on it's own.

let allSockets: net.Socket[] = [];
// store all connections of sockets.

const tcpServer: net.Server = net.createServer((socket: net.Socket) => {
  allSockets.push(socket); // each connection, push to array
  HandleTCP(socket, allSockets, rooms, userRooms); // set up handlers for each socket
});

tcpServer.listen(3001, () => {
  console.log('opened TCP server on', tcpServer.address());
}); 

server.bind(3000); // start UDP server

