let {Timer} = require('../build/node');


describe('UI functions', () => {

    beforeEach(() => {
        this.timer = new Timer('1:145:4:05:9.40', {startPaused: true}) // milliseconds becomes ".400"
    });

    it('getMillisecondsUI', () => {
        expect(this.timer.getMillisecondsUI()).toEqual('400');
    });
    it('getSecondsUI', () => {
        expect(this.timer.getSecondsUI()).toEqual('09');
    });
    it('getMinutesUI', () => {
        expect(this.timer.getMinutesUI()).toEqual('5');
    });
    it('getHoursUI', () => {
        expect(this.timer.getHoursUI()).toEqual('4');
    });
    it('getDaysUI', () => {
        expect(this.timer.getDaysUI()).toEqual('145');
    });
    it('getYearsUI', () => {
        expect(this.timer.getYearsUI()).toEqual('1');
    });
    it('works with padding', () => {
        expect(this.timer.getYearsUI(3)).toEqual('001');
        expect(this.timer.getSecondsUI(0)).toEqual('9');
        expect(this.timer.getDaysUI(2)).toEqual('145'); // same value if padding < length of digits.
        expect(this.timer.getHoursUI(2)).toEqual('04');
    });

    it('getFullTimeUI', () => {
        expect(this.timer.getFullTimeUI()).toEqual('1:145:04:05:09');
        expect(this.timer.getFullTimeUI(true)).toEqual('1:145:04:05:09:400');
    });

    it('fmtTime', () => {
        expect(this.timer.fmtTime('%H-%M')).toEqual('4-5');
        expect(this.timer.fmtTime('%3%Y%%')).toEqual('001%');
        expect(this.timer.fmtTime('hello world %m %1%M %m dlrow ollhe')).toEqual('hello world 400 5 400 dlrow ollhe');
        expect(this.timer.fmtTime('hello')).toEqual('hello');
    });
});