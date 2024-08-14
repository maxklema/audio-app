"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandleTCP;
const ipv4_1 = __importDefault(require("./ipv4"));
function HandleTCP(socket, allSockets, rooms, userRooms, users, general, multicastIPs) {
    socket.on('data', (data) => {
        const message = JSON.parse(data.toString());
        const senderIP = socket.remoteAddress; // grab IP of sender
        if (!senderIP) {
            console.log("Could not get user's IP");
            return; // failure response
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
        } // Note: will need to incorporate some success/failure responses to send to User.
    });
}
function BroadcastRooms(allSockets, userRooms) {
    let dataToSend = JSON.stringify(userRooms);
    allSockets.forEach((socket) => {
        socket.write(dataToSend);
    }); // write current rooms/users to all clients
}
function JoinCall(message, userIP, userRooms, users, general) {
    userRooms["general"].push(message.user); // push user to general multicast group
    users.set(userIP, "general");
    general.add(userIP);
}
function LeaveCall(message, userIP, userRooms, users, general) {
    if (message.room) {
        userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
        users.delete(userIP);
        general.delete(userIP);
    }
    else {
        console.log("No room provided on leaveCall request");
    }
}
function CreateRoom(message, userIP, rooms, userRooms, users, general, multicastIPs) {
    if (message.room) {
        let newIP = (0, ipv4_1.default)(multicastIPs); // Need to write code for generating multicast IP
        rooms.set(message.room, newIP);
        if (!userRooms[message.room]) {
            userRooms[message.room] = [message.user]; // make a new room with only user in it.
        }
        else
            console.error("Already a room with that name");
        general.delete(userIP);
        users.set(userIP, message.room);
    }
}
function JoinRoom(message, userIP, userRooms, users, general) {
    if (message.room) {
        userRooms[message.room].push(message.user);
        users.set(userIP, message.room);
        general.delete(userIP);
    }
    else {
        console.log("No room provided on joinRoom request");
    }
}
function LeaveRoom(message, userIP, userRooms, users, general) {
    if (message.room) {
        userRooms[message.room] = userRooms[message.room].filter(user => user !== message.user);
        if (message.room === "general") { // leaving general to join another group
            general.delete(userIP);
        }
        else { // rejoin general if leaving a multicast group
            users.set(userIP, "general");
            general.add(userIP);
        }
    }
    else {
        console.log("No room provided in joinRoom request.");
    }
}
