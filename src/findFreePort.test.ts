import {getUsedPorts} from './getUsedPorts';
import {expect} from 'chai';

describe('getUsedPorts', function () {
    it('should return a set of ports for whatever the current system is', async function () {
        const ports = await getUsedPorts();
        expect(ports).to.be.instanceOf(Set);
        for (let port of ports) {
            expect(port).to.be.a('number');
            expect(port).to.be.above(0);
        }
    });
});
