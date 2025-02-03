import {getUsedPorts} from './getUsedPorts';
import {test} from 'node:test';
import assert from "node:assert";

test('getUsedPorts should return a set of ports for whatever the current system is', async () => {
    const ports = await getUsedPorts();
    assert(ports instanceof Set);
    for (let port of ports) {
        assert(typeof port === 'number');
        assert(port > 0);
    }
});
