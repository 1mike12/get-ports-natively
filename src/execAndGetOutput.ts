import {exec} from 'child_process';

export async function execAndGetOutput(cmd: string) {
    return new Promise<string>((resolve, reject) => {
        exec(cmd, (error, stdout, _stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        })

    })
}
