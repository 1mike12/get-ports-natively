import {execAndGetOutput} from "../execAndGetOutput";

export async function getWindowsPorts() {
    const command = `netstat -an | Select-String "LISTENING" | ForEach-Object { (($_.ToString() -split "\\s+")[1] -replace '^\\[|\\]$', '') -split ":" | Select-Object -Last 1 } | Sort-Object -Unique`
    const result = await execAndGetOutput(command);
    const set = new Set<number>()
    for (let line of result.split('\n')) {
        const port = parseInt(line.trim());
        if (port) {
            set.add(port);
        }
    }
    return set;
}
