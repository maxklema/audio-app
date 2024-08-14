"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = __importStar(require("dgram"));
let udpVersion = "udp6";
const server = dgram.createSocket(udpVersion);
// const client = new net.Socket();
// const joinCall = {
//   type: "joinCall",
//   user: "test user 1"
// };
// client.connect(3001, 'localhost', () => {
//   client.write(JSON.stringify(joinCall));
//   console.log("sent")
// });  
// server.bind(3005)
// server.on("listening", () => {
//   server.addMembership("ff05::ff49:0929:f5db:2c12", "::%en0");
// })
// server.on('message', (message: Buffer, rinfo: dgram.RemoteInfo) => {
//   console.log(message)
// })
