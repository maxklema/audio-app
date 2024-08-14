
export default function generateIP(multicastIPs: Set<string>) {
  let address: string = getIP();
  if (multicastIPs.has(address)) {
    return generateIP(multicastIPs);
  } else {
    multicastIPs.add(address);
    return address;
  }

}

function getIP() {
  return `239.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

