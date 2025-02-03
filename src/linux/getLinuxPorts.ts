import {execAndGetOutput} from "../execAndGetOutput";

export async function getLinuxPorts() {
    const command = 'netstat -an | awk \'/LISTEN/ { n = split($4, a, "."); print a[n] }\' | sort -un'
    const result = await execAndGetOutput(command);
    const set = new Set<number>();
    for (let line of result.split('\n')) {
        const port = parseInt(line.trim());
        if (port) {
            set.add(port);
        }
    }
    return set;
}
