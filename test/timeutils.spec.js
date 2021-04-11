const timeutil = require('../build/node/timeutil');


describe('timeutils', () => {
    describe('setGoodInterval', () => {

        //TODO. Use sinon spies with multiple call returns to return specific times in Date.now()
        it('runs on an interval', (done) => {
            let callCount = 0;
            const callback = () => {
                callCount++;
                if(callCount > 3) {
                    done();
                }
            };
            timeutil.setGoodInterval(callback, 1000);
        });
        it('returns an id that can be cleared', (done) => {
            const badCallback = () => {
                fail('badCallback should never be called if interval was cleared');
            };
            const goodCallback = () => {
                done();
            };
            timeutil.setGoodInterval(() => null, 500);
            const badId = timeutil.setGoodInterval(badCallback, 1000);
            timeutil.setGoodInterval(goodCallback, 2000);
            timeutil.clearGoodInterval(badId);
        });
    });
});