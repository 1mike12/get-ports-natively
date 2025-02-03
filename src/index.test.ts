import {hello} from './index';
import {test} from 'node:test';

import assert from 'assert';

test('hello function should return "world"', () => {
    assert.strictEqual(hello(), 'world');
});
