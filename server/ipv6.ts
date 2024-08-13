import * as crypto from 'crypto'

export default function generateIP() {
    const scope: string = 'ff05::'; // Site-local scope for multicast
    const groupId: string = crypto.randomBytes(14).toString('hex'); // Generates a random 112-bit number
    return `${scope}${groupId.slice(0, 4)}:${groupId.slice(4, 8)}:${groupId.slice(8, 12)}:${groupId.slice(12, 16)}`;
}


console.log(generateIP());