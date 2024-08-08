import * as dgram from 'dgram';
import { MongoClient } from 'mongodb';
import { StartDB, FetchDB } from './db';

const client: MongoClient = new MongoClient('mongodb://localhost:27017');

let userData: any[]; // where we update user data from DB

let udpVersion: dgram.SocketType = "udp6";
const server: dgram.Socket = dgram.createSocket(udpVersion);

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

async function main() {
  StartDB(client);
  userData = await FetchDB(client);
  server.bind(41234); // start udp server
  console.log(userData);
}

main();




