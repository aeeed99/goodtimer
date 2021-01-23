let { Time } = require('../build/time');


describe('Time class', () => {
    it('creates time object out of parsing strings', () => {
       let time = new Time('1:00');
       expect(time.milliseconds).toBe(0);
       expect(time.seconds).toBe(0);
       expect(time.minutes).toBe(1);
       expect(time.hours).toBe(0);
       expect(time.days).toBe(0);
       expect(time.years).toBe(0);
    });

    it('parses as milliseconds when passed a number', () => {
        let time = new Time(555);
        expect(time.milliseconds).toBe(555);
        expect(time.seconds).toBe(0);
    });

    describe('in', () => {
        it('milliseconds returns total milliseconds', () => {
            const time = new Time(1000);
            expect(time.inMilliseconds()).toBe(1000);
            expect(time.seconds).toBe(1);
        })

        it('seconds returns total seconds', () => {
            const time = new Time('5:00');
            expect(time.inSeconds).toBe(300);
        })
        it('all other units return correctly', () => {
            const time = new Time('2yrs');
            expect(time.inYears).toBe(2);
            expect(time.inDays).toBe(730);
            expect(time.inHours).toBe(17_520);
            expect(time.inMinutes).toBe(1_051_200);
        })
    })

    describe('math functions', () => {
        it('can add another Time instance', () => {
            let time = new Time(':30');
            expect(time.seconds).toBe(30);
            expect(time.minutes).toBe(0);
            time.add(new Time(':30'));
            expect(time.seconds).toBe(0);
            expect(time.minutes).toBe(1);
        });

        it('can add by parsing time', () => {
            let time = new Time(':1:00');
            time.add('1:00');
            time.add(1000);
            expect(time.mins).toBe(2);
            expect(time.seconds).toBe(1);
        })
    })

    describe('_fromMilliSeconds returns arrays of numbers from milliseconds', () => {
        expect(Time.prototype._fromMiliseconds(1).toString()).toBe([0, 0, 0, 0, 0, 1].toString());
        expect(Time.prototype._fromMiliseconds(1000).toString()).toBe([0,0,0,0,1,0].toString());
        expect(Time.prototype._fromMiliseconds(60_000).toString()).toBe([0,0,0,1,0,0].toString());
        expect(Time.prototype._fromMiliseconds(315_57_600_000).toString()).toBe([1,0,0,0,0,0].toString());
        expect(Time.prototype._fromMiliseconds(315_57_661_001).toString()).toBe([1,0,0,6,1,1].toString());

    })
})

