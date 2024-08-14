"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandleUDP;
function HandleUDP(server, rooms, users, general) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (audio, rinfo) => {
        console.log(`server got: ${audio} from ${rinfo.address}:${rinfo.port}`);
        const userIP = rinfo.address;
        const userRoom = users.get(userIP) || "";
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
        const address = server.address();
        console.log(`UDP server listening ${address.address}:${address.port}`);
    });
}
