import * as dgram from 'dgram';
import express from 'express';
import router from './api'

const api = express();
const port: Number = 3001;

api.use(express.json());
api.use(router); // get api routes.

api.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

let udpVersion: dgram.SocketType = "udp4"
const server: dgram.Socket = dgram.createSocket(udpVersion);

const rooms: Map<string, Set<string>> = new Map<string, Set<string>>();

server.on('error', (err: Error) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address: dgram.BindOptions = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3000);

export function CreateRoom(room: string, user: string) {
  rooms.set(room, new Set<string>([user]));
}

export function JoinRoom(room: string, user: string): boolean {
  if (rooms.has(room)) {
    rooms.get(room)?.add(user);
    return true;
  } else {
    return false;
  }
}