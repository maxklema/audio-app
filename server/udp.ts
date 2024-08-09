import dgram from 'dgram';


export default function SetUpUDP(server: dgram.Socket): void {
  
  server.on('error', (err: Error) => { // udp
    console.error(`server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  
  server.on('listening', () => {
    const address: dgram.BindOptions = server.address();
    console.log(`UDP server listening ${address.address}:${address.port}`);
  });
}
