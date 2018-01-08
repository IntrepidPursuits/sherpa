import { safeCb } from './util';
import { expect } from 'chai';

describe('Util', () => {
    it('Has a safeCb function', () => {
        let notAFunction = undefined;

        expect(safeCb(notAFunction)).to.not.throw(Error);
    });
});
