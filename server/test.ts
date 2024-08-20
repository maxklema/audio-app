import * as dgram from 'dgram';
import * as net from "net";

let udpVersion: dgram.SocketType = "udp4";
const server: dgram.Socket = dgram.createSocket(udpVersion);

interface Message {
  type: "Office" | "Conference"
}

const users: Map<string, string> = new Map<string, string>();
const groups: Map<string, string> = new Map<string, string>();

groups.set("Office", "239.1.1.1");
groups.set("Conference", "239.2.2.2");


const tcpServer: net.Server = net.createServer(socket => {
  console.log("client connected");
  if (!socket.remoteAddress) {
    console.log("Couldn't grab IP")
    return
  }
  const clientIp: string = socket.remoteAddress;
  users.set(clientIp, "Office"); // defualt to Office
  

  socket.on('data', (data: string) => {
    
    const message: Message = JSON.parse(data);
    console.log(message)
    users.set(clientIp, message.type);
    
  });
  socket.on('end', () => {
    console.log('Client disconnected');
  });
})

// Start the server on port 3000
tcpServer.listen(3000, () => {
  console.log('TCP server listening on port 3000');
});



server.on('message', (message: Buffer, rinfo: dgram.RemoteInfo) => {
  if (!rinfo.address) return;
  let client: string = rinfo.address;

  let userGroup: string | undefined = users.get(client);

  if (!userGroup) return;
  let multicastIP: string | undefined = groups.get(userGroup);
  if (!multicastIP) return;

  for (const groupIP in groups.values()) {
    if (groupIP !== multicastIP) {
      server.send(message, 8081, groupIP);
    }
  }
});

  
  


server.bind(3001)




