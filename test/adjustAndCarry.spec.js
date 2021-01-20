let { Timer } = require('../build/goodtimer');

var self = {}

describe('Timer.adjustAndCarry', () => {
    beforeEach(function () {
        self.adjustAndCarry = Timer.prototype.adjustAndCarry;
        self.timer = {
            secs: [0],
            mins: [0],
            hours: [0],
            days: [0],
            years: [0],
        }
    })

    it('is a function', function() {
        expect(typeof self.adjustAndCarry).toEqual('function')
    })

    it('can decrement seconds', () => {
        self.timer.secs = [10];
        self.adjustAndCarry(self.timer.secs, 59, -1);
        expect(self.timer.secs[0]).toEqual(9);
        self.adjustAndCarry(self.timer.secs, 59, -1);
        expect(self.timer.secs[0]).toEqual(8);
    })

    it('returns a carry-over value when decrementing below zero', () => {
        self.timer.secs = [0];
        let carryOver = self.adjustAndCarry(self.timer.secs, 59, -1);
        expect(self.timer.secs[0]).toEqual(59);
        expect(carryOver).toEqual(-1);
    })

    it('returns a carry-under when incrementing above boundary', () => {
        self.timer.secs = [59];
        let carryUnder = self.adjustAndCarry(self.timer.secs, 59, 1);
        expect(self.timer.secs[0]).toEqual(0);
        expect(carryUnder).toEqual(1);
    })
})