import {getUsedPorts} from "./getUsedPorts";

export async function findFreePort(startPort = 3000, endPort = 65535): Promise<number | null> {
    if (startPort < 1 || startPort > 65535) {
        throw new Error('start port number out of range');
    }
    if (endPort < 1 || endPort > 65535) {
        throw new Error('end port number out of range');
    }
    const usedPorts = await getUsedPorts();

    for (let port = startPort; port <= endPort; port++) {
        if (!usedPorts.has(port)) {
            return port;
        }
    }
    return null
}
