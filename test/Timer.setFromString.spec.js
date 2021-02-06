/** Tests for the Timer class
 *  Timer syntax is read an array of numbers!
 *  [year, day, hour, minute, second, millisecond]
 *
 *  ! millisecond is new and is tested in a dedicated suite. First few suites don't
 *    test milliseconds, so the last value of each array is always 0 for them.
 **/

let {Timer} = require('../build/goodtimer');
console.dir(Timer.prototype)
var self = {};

describe('Timer _parse', () => {

    beforeEach(() => {
        self.parse = new Timer('1')._parse;
    });

    it('Sets the timer from colon separated syntax', () => {
        expect(self.parse('01')).toEqual([0, 0, 0, 0, 1, 0]);
        expect(self.parse('3:05:15')).toEqual([0, 0, 3, 5, 15, 0]);
        expect(self.parse('00:00:59')).toEqual([0, 0, 0, 0, 59, 0]);
        expect(self.parse(':90')).toEqual([0, 0, 0, 0, 90, 0]); // does not implement any carryover
    });

    it('Sets the timer for values separated by any value other than a diget', () => {
        expect(self.parse('5-0-0')).toEqual([0, 0, 5, 0, 0, 0]);
        expect(self.parse('3 4&4!9,4')).toEqual([3, 4, 4, 9, 4, 0]);
    });

    it('Sets the timer for values in abbreviated notation', () => {
        expect(self.parse('2s')).toEqual([0, 0, 0, 0, 2, 0]);
        expect(self.parse('5y8d4h9m20s')).toEqual([5, 8, 4, 9, 20, 0]);
        expect(self.parse('4d1m')).toEqual([0, 4, 0, 1, 0, 0]);
        expect(self.parse('45m25s1y1h')).toEqual([1, 0, 1, 45, 25, 0]);
    })

    describe('millisecond parsing', () => {
        it('parses from colon separated syntax', () => {
            expect(self.parse('5:00.500')).toEqual([0, 0, 0, 5, 0, 500]);
            expect(self.parse('.25')).toEqual([0, 0, 0, 0, 0, 25]);
            expect(self.parse(':25')).toEqual([0, 0, 0, 0, 25, 0]);
        })
        it('parses from abbreviated notation', () => {
            expect(self.parse('315ms')).toStrictEqual([0,0,0,0,0,315]);
            expect(self.parse('1d4ms5m6s')).toStrictEqual([0,1,0,5,6,4]);
        })
    })
})