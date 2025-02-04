import {getMacPorts} from './getMacPorts';
import * as os from 'os';
import {expect} from 'chai';

describe('getMacPorts', function () {
    before(function () {
        if (os.platform() !== 'darwin') {
            this.skip();
        }
    });

    it('should return a set of ports', async function () {
        const ports = await getMacPorts();
        expect(ports).to.be.instanceOf(Set);
        for (let port of ports) {
            expect(port).to.be.a('number');
            expect(port).to.be.above(0);
        }
    });
});
