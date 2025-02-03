import {getMacPorts} from './getMacPorts';
import * as os from 'os';
import assert from 'assert';
import test from 'node:test';

test('getMacPorts', {skip: os.platform() !== 'darwin'}, async () => {
    const ports = await getMacPorts();
    assert(ports instanceof Set, 'Expected ports to be an instance of Set');
    for (let port of Array.from(ports)) {
        assert(typeof port === 'number', 'Expected port to be a number');
        assert(port > 0, 'Expected port to be above 0');
    }
});
