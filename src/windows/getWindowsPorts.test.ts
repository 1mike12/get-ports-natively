import * as os from 'os';
import assert from 'node:assert';
import test from 'node:test';
import {getWindowsPorts} from "./getWindowsPorts";

test('getMacPorts', {skip: os.platform() !== 'win32'}, async () => {
    const ports = await getWindowsPorts();
    assert(ports instanceof Set, 'Expected ports to be an instance of Set');
    for (let port of Array.from(ports)) {
        assert(typeof port === 'number', 'Expected port to be a number');
        assert(port > 0, 'Expected port to be above 0');
    }
});
