import dgram from 'dgram';




export default function HandleUDP(server: dgram.Socket, rooms: Map<string, string>, users: Map<string, string>, general: Set<string>): void {
  
  server.on('error', (err: Error) => { // udp
    console.error(`server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (audio: Buffer, rinfo: dgram.RemoteInfo) => {
    console.log(`server got: ${audio} from ${rinfo.address}:${rinfo.port}`);
    const userIP: string = rinfo.address;
    const userRoom: string = users.get(userIP) || "";

    if (userRoom === "general") {
      for (const recipient of general) {
        if (recipient !== userIP) {
          server.send(audio, 1234, recipient);
        }
      }
    } // if in general, go through all IPs in general and send if not the user

    for (const [room, IP] of rooms) {
      if (room !== userRoom) {
        server.send(audio, 1234, IP);
      }
    } // send to all rooms except the one user is in

  });
  
  server.on('listening', () => {
    const address: dgram.BindOptions = server.address();
    console.log(`UDP server listening ${address.address}:${address.port}`);
  });
}
