import {strict as assert} from 'assert';
import {getUsedPorts} from './getUsedPorts';
import {test} from "node:test";

test('getUsedPorts should return a set of ports for whatever the current system is', async () => {
    const ports = await getUsedPorts();
    for (let port of ports) {
        assert(typeof port === 'number');
        assert(port > 0);
    }
});
