import * as dgram from 'dgram';
import * as net from "net";

let udpVersion: dgram.SocketType = "udp4";
const server: dgram.Socket = dgram.createSocket(udpVersion);

interface Message {
  type: "Office" | "Conference"
}

let users: Map<string, string> = new Map<string, string>();
let groups: Map<string, string> = new Map<string, string>();

groups.set("Office", "239.1.1.1");
groups.set("Conference", "239.2.2.2");


const tcpServer: net.Server = net.createServer(socket => {
  console.log("client connected");
  if (!socket.remoteAddress) {
    console.log("Couldn't grab IP")
    return
  }
  const clientIp: string = socket.remoteAddress;
  users.set(clientIp, "Office"); // default to Office
  console.log(users)
  

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
tcpServer.listen(3000, '0.0.0.0', () => {
  console.log('TCP server listening on port 3000');
});



server.on('message', (message: Buffer, rinfo: dgram.RemoteInfo) => {

  let client = rinfo.address;


  let userGroup = users.get(client);

  let multicastIP: string | undefined;



  if (userGroup !== undefined) {
    multicastIP = groups.get(userGroup);


  }

  

  
    
    if (multicastIP === '239.1.1.1') {
      server.send(message, 8081, "239.2.2.2");
      
      console.log("sent from Office to Conference")
    } else {
      server.send(message, 8081, "239.1.1.1");
      console.log("sent from Conference to Office")
    }
  
});

  
  


server.bind(3001)




