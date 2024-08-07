import * as dgram from 'dgram';

let udpVersion: dgram.SocketType = "udp4"
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

server.bind(41234);