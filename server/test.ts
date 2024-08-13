import * as dgram from 'dgram';
import * as net from "net";

let udpVersion: dgram.SocketType = "udp6";
const server: dgram.Socket = dgram.createSocket(udpVersion);

// const client = new net.Socket();

// const joinCall = {
//   type: "joinCall",
//   user: "test user 1"
// };

// client.connect(3001, 'localhost', () => {
//   client.write(JSON.stringify(joinCall));
//   console.log("sent")
// });



server.bind(3005)

server.on("listening", () => {
  server.addMembership("ff05::ff49:0929:f5db:2c12", "en0");
})

server.on('message', (message: Buffer, rinfo: dgram.RemoteInfo) => {
  console.log(message)
})
