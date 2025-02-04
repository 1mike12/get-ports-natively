import {getUsedPorts} from '../src/getUsedPorts';
import net from 'net';

const HIGHEST_PORT_NUMBER = 65535;

async function checkPortStatus(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close(() => resolve(true));
        });
        server.listen(port);
    });
}

async function getUsedPortsNetModule(): Promise<Set<number>> {
    const usedPorts = new Set<number>();
    for (let port = 1; port <= HIGHEST_PORT_NUMBER; port++) {
        const isUsed = await checkPortStatus(port);
        if (!isUsed) {
            usedPorts.add(port);
        }
    }
    return usedPorts;
}

async function benchmarkNetModule() {
    const start = process.hrtime.bigint();
    const usedPorts = await getUsedPortsNetModule();
    const end = process.hrtime.bigint();
    return {time: end - start, usedPorts};
}

async function benchmarkGetUsedPorts() {
    const start = process.hrtime.bigint();
    const usedPorts = await getUsedPorts();
    const end = process.hrtime.bigint();
    return {time: end - start, usedPorts};
}

function convertNanosecondsToSecondsAndMilliseconds(nanoseconds: bigint) {
    const seconds = Number(nanoseconds) / 1e9;
    const milliseconds = Number(nanoseconds) / 1e6;
    return {seconds, milliseconds};
}

async function runBenchmarks() {
    console.log('Running benchmarks...');

    const netModuleResult = await benchmarkNetModule();
    const netModuleConverted = convertNanosecondsToSecondsAndMilliseconds(netModuleResult.time);
    console.log(`net module took ${netModuleConverted.seconds} seconds (${netModuleConverted.milliseconds} milliseconds)`);

    const getUsedPortsResult = await benchmarkGetUsedPorts();
    const getUsedPortsConverted = convertNanosecondsToSecondsAndMilliseconds(getUsedPortsResult.time);
    console.log(`getUsedPorts took ${getUsedPortsConverted.seconds} seconds (${getUsedPortsConverted.milliseconds} milliseconds)`);
    console.log(`Speed difference: ${Math.round(netModuleConverted.milliseconds / getUsedPortsConverted.milliseconds)}X faster`);
}

runBenchmarks().catch(console.error);
