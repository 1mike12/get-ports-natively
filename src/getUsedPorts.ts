import {getMacPorts} from "./mac/getMacPorts";
import {getLinuxPorts} from "./linux/getLinuxPorts";
import {getWindowsPorts} from "./windows/getWindowsPorts";

export async function getUsedPorts(): Promise<Set<number>> {
    switch (process.platform) {
        case 'win32':
            return getWindowsPorts()
        case 'darwin':
            return getMacPorts()
        case 'linux':
            return getLinuxPorts()
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}
