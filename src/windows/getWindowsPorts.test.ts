import * as os from 'os';
import {expect} from 'chai';
import {getWindowsPorts} from './getWindowsPorts';

describe('getWindowsPorts', function () {
    before(function () {
        if (os.platform() !== 'win32') {
            this.skip();
        }
    });

    it('should return a set of ports', async function () {
        const ports = await getWindowsPorts();
        expect(ports).to.be.instanceOf(Set);
        for (let port of Array.from(ports)) {
            expect(port).to.be.a('number');
            expect(port).to.be.above(0);
        }
    });
});
