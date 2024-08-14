"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateIP;
function generateIP(multicastIPs) {
    let address = getIP();
    if (multicastIPs.has(address)) {
        return generateIP(multicastIPs);
    }
    else {
        multicastIPs.add(address);
        return address;
    }
}
function getIP() {
    return `239.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}
