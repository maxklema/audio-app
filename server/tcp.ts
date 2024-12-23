import * as net from "net";
import { RoomContent } from './main';
import generateIP from "./ipv4";

interface Message {
  type: 'leaveRoom' | 'joinRoom' | 'createRoom' | 'joinCall' | 'leaveCall' | 'deleteRoom';
  user: string;
  room?: string; // don't need room for joinCall
}

export default function HandleTCP(socket: net.Socket, allSockets: net.Socket[], rooms: Map<string, string>, userRooms: RoomContent, users: Map<string, string>, general: Set<string>, multicastIPs: Set<string>) {
  socket.on('data', (data) => {
    const message: Message = JSON.parse(data.toString());
    const senderIP: string | undefined = socket.remoteAddress; // grab IP of sender
    if (!senderIP) {
      console.log("Could not get user's IP"); 
      return;  // failure response
    }
    switch (message.type) {
      case 'joinCall':
        JoinCall(message, senderIP, userRooms, users, general);
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'leaveCall':
        LeaveCall(message, senderIP, userRooms, users, general);
        BroadcastRooms(allSockets, userRooms);
        break; // remove user from the room they were in
      case 'createRoom':
        CreateRoom(message, senderIP, rooms, userRooms, users, general, multicastIPs);
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'joinRoom':
        JoinRoom(message, senderIP, userRooms, users, general);
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'leaveRoom':
        LeaveRoom(message, senderIP, userRooms, users, general);
        BroadcastRooms(allSockets, userRooms);
        break;
      case 'deleteRoom':
        DeleteRoom(message, rooms, userRooms, users, general, multicastIPs);
        BroadcastRooms(allSockets, userRooms);
    } // Note: will need to incorporate some success/failure responses to send to User.
  })
}

function BroadcastRooms(allSockets: net.Socket[], userRooms: RoomContent) {
  let dataToSend: string = JSON.stringify(userRooms);
  allSockets.forEach((socket) => {
    socket.write(dataToSend);
  }) // write current rooms/users to all clients
}

function JoinCall(message: Message, userIP: string, userRooms: RoomContent, users: Map<string, string>, general: Set<string>) {
  userRooms["general"].push(message.user); // push user to general multicast group
  users.set(userIP, "general");
  general.add(userIP);
}

function LeaveCall( message: Message, userIP: string, userRooms: RoomContent, users: Map<string, string>, general: Set<string>) {
  if (message.room) {
    userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
    users.delete(userIP);
    general.delete(userIP);
  } else {
    console.log("No room provided on leaveCall request")
  }
}

function CreateRoom(message: Message, userIP: string, rooms: Map<string, string>, userRooms: RoomContent, users: Map<string, string>, general: Set<string>, multicastIPs: Set<string>) {
  if (message.room) {
    let newIP: string = generateIP(multicastIPs); // Need to write code for generating multicast IP
    rooms.set(message.room, newIP);
    if (!userRooms[message.room]) {
      userRooms[message.room] = [message.user]; // make a new room with only user in it.
    } else console.error("Already a room with that name");
    general.delete(userIP);
    users.set(userIP, message.room);
  } 
}

function JoinRoom(message: Message, userIP: string, userRooms: RoomContent, users: Map<string, string>, general: Set<string>) {
  if (message.room) {
    userRooms[message.room].push(message.user);
    users.set(userIP, message.room)
    general.delete(userIP);
  } else {
    console.log("No room provided on joinRoom request")
  }
}

function LeaveRoom(message: Message, userIP: string, userRooms: RoomContent, users: Map<string, string>, general: Set<string>) {
  if (message.room) {
    userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
    userRooms["general"].push(message.user);
    if (message.room === "general") { // leaving general to join another group
      general.delete(userIP);
    } else { // rejoin general if leaving a multicast group
      users.set(userIP, "general");
      general.add(userIP);
    }
  } else {
    console.log("No room provided in joinRoom request.")
  }
}

function DeleteRoom(message: Message, rooms: Map<string, string>, userRooms: RoomContent, users: Map<string, string>, general: Set<string>, multicastIPs: Set<string>) {
  if (message.room) {
    let roomIP = rooms.get(message.room);
    if (roomIP) multicastIPs.delete(roomIP); // delete multicast IP
    rooms.delete(message.room); // delete room
    
    for (const [userIP, group] of users) {   // user IP and group name
      if (group === message.room) { // if user in group to be removed
        users.set(userIP, "general"); // change user to general
        general.add(userIP); // add user IP to general
      }
    } 

    for (const [room, users] of Object.entries(userRooms)) {
      if (room === message.room) { // if correct room to be deleted
        userRooms["general"] = userRooms["general"].concat(users); // add users to general
        delete userRooms[room]; // delete room
        break; // Exit the loop after making changes
      }
    }
  } else {
    console.log("No room provided in joinRoom request.")
  }
}
