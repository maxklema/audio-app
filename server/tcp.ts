import * as net from "net";
import { RoomContent } from './main';



interface Message {
  type: 'leaveRoom' | 'joinRoom' | 'createRoom' | 'joinCall' | 'leaveCall';
  user: string;
  room?: string; // dont need room for joinCall
}

export default function HandleTCP(socket: net.Socket, allSockets: net.Socket[], rooms: Map<string, string>, userRooms: RoomContent) {
  socket.on('data', (data) => {
    const message: Message = JSON.parse(data.toString());
    switch (message.type) {
      case 'joinCall':
        userRooms["general"].push(message.user); // push user to general multicast group
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'leaveCall':
        if (message.room) userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
        BroadcastRooms(allSockets, userRooms);
        break; // remove user from the room they were in
      case 'createRoom':
        createRoom(message, rooms, userRooms);
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'joinRoom':
        if (message.room) userRooms[message.room].push(message.user);
        BroadcastRooms(allSockets, userRooms);
      case 'leaveRoom':
        if (message.room) userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
        BroadcastRooms(allSockets, userRooms);
    }
  })
}

function BroadcastRooms(allSockets: net.Socket[], userRooms: RoomContent) {
  let dataToSend: string = JSON.stringify(userRooms);
  allSockets.forEach((socket) => {
    socket.write(dataToSend);
  }) // write current rooms/users to all clients
}

function createRoom(message: Message, rooms: Map<string, string>, userRooms: RoomContent) {
  if (message.room) {
    let newIP: string = ""; // Need to write code for generating multicast IP
    rooms.set(message.room, newIP);
    if (!userRooms[message.room]) {
      userRooms[message.room] = [message.user]; // make a new room with only user in it.
    } else console.error("Already a room with that name")
  } 
}



