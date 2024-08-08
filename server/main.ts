import * as dgram from 'dgram';
import express from 'express';
import router from './api'
import SetUpUDP from './udp';



type RoomInfo = { // what each room maps to
  users: Set<string>;
  multicastAddress: string;
};

let rooms: Map<string, RoomInfo> = new Map<string, RoomInfo>();
// map contains rooms(multicast groups) with each having a set of user IPs.

const api = express();
const APIport: number = 3001;
api.use(express.json());
api.use(router); // get api routes.

let udpVersion: dgram.SocketType = "udp4"
const server: dgram.Socket = dgram.createSocket(udpVersion);
SetUpUDP(server); // get event handlers for UDP server


// NOTE:
// When setting up a server, will need to fetch prior room data for host.
// This will have to be stored on a server/cloud database on it's own.
server.bind(3000);
api.listen(APIport, () => {
  console.log(`API is running at http://localhost:${APIport}`);
});

export function CreateRoom(room: string, user: string): boolean {
  if (rooms.has(room)) return false;
  rooms.set(room, {
    users: new Set<string>([user]),
    multicastAddress: "" // generate and return
  }); // create new room and add user to it.
  console.log(rooms);
  return true;
}

export function JoinRoom(room: string, user: string): boolean {
  if (rooms.has(room)) {
    rooms.get(room)?.users.add(user);
    return true;
  } else {
    return false;
  }
}