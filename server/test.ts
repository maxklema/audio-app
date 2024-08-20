import * as dgram from 'dgram';
import * as net from "net";

let udpVersion: dgram.SocketType = "udp4";
const server: dgram.Socket = dgram.createSocket(udpVersion);

interface Message {
  type: "office" | "conference"
}

const tcpServer: net.Server = net.createServer(socket => {
  console.log("client connected");
  const clientIp: string | undefined = socket.remoteAddress;
  socket.on('data', (data: string) => {
    const message: Message = JSON.parse(data);

    if (message.type === "office") {

    } else if (message.type === "conference") {

    }
    
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
})

// Start the server on port 8080
tcpServer.listen(3000, () => {
  console.log('TCP server listening on port 8080');
});

const users: Set<string> = new Set<string>();

server.on('message', (message: Buffer, rinfo: dgram.RemoteInfo) => {
  if (!users.has(rinfo.address)) users.add(rinfo.address);
  users.forEach(user => {
    console.log(rinfo.address, user)
    if (rinfo.address !== user) {
      server.send(message,8081,user);
      
    }
    
  })
  
})

server.on('listening', () => {
  server.addMembership("239.99.211.90");
})

server.bind(3001)




