import {execAndGetOutput} from "../execAndGetOutput";

export async function getWindowsPorts() {
    // Using CMD commands: findstr for filtering and for /f for string processing
    const command = `netstat -an | findstr "LISTENING" | for /f "tokens=2" %i in ('findstr ":"') do @echo %i | for /f "tokens=2 delims=:" %j in ('more') do @echo %j`;
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
