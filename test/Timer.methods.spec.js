let {Timer} = require('../build/goodtimer');


describe('Timer methods', () => {
    describe('getTime', () => {
        it('uses the default fmtTime call', () => {
            const timer = new Timer('2h', { startPaused: true });

            const fmtTime = jest.spyOn(timer, 'fmtTime');

            expect(timer.getTime()).toBe('0:0:2:0:0.0')
            expect(fmtTime).toHaveBeenCalled();
        });
    });
})