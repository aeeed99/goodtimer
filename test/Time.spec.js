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

    it('Starts at 0 by default (no arguments passed', () => {
        const time = new Time();
        expect(time.milliseconds).toBe(0)
        expect(time.seconds).toBe(0)
        expect(time.minutes).toBe(0)
        expect(time.hours).toBe(0)
        expect(time.days).toBe(0)
        expect(time.years).toBe(0)
    })

    xdescribe('in', () => {
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
        });

        xit('can subtract from another Time instance', () => {
            const time = new Time('10:00:01.500');
            time.subtract(':01');
            expect(time.seconds).toBe(0);
            time.subtract('.600');
            expect(time.milliseconds).toBe(900);
            expect(time.seconds).toBe(59);
            expect(time.minutes).toBe(59);
            expect(time.hours).toBe(9);
        });
    });

    describe('getters and setters', () => {
        it('on milliseconds', () => {
            const time = new Time(0);
            expect(time.milliseconds).toBe(0);
            time.milliseconds = 10;
            expect(time.milliseconds).toBe(10);
        })

        it('on milliseconds carries over', () => {
            const time = new Time(0);
            time.milliseconds = 1000;
            expect(time.milliseconds).toBe(0);
            expect(time.seconds).toBe(1);
        })

        it('on seconds', () => {
            const time = new Time(0);
            expect(time.seconds).toBe(0)
            time.seconds = 50;
            expect(time.seconds).toBe(50)
        });

        it('on seconds carires over', () => {
            const time = new Time(0);
            time.seconds = 90;
            expect(time.seconds).toBe(30);
            expect(time.minutes).toBe(1);
        })

        it('on minutes carries over', () => {
            const time = new Time(0);
            time.minutes = 120;
            expect(time.hours).toBe(2);
            expect(time.minutes).toBe(0);
        })

        it('on hours carries over', () => {
            const time = new Time(0);
            time.hours = 47;
            expect(time.hours).toBe(23);
            expect(time.days).toBe(1);
        })
        it('on days carries over', () => {
            const time = new Time(0);
            time.days = 365;
            expect(time.years).toBe(1);
            expect(time.milliseconds).toBe(0);
            expect(time.seconds).toBe(0);
            expect(time.minutes).toBe(0);
            expect(time.hours).toBe(0);
            expect(time.days).toBe(0);
        })
    })

    it('_fromMilliSeconds returns arrays of numbers from milliseconds', () => {
        expect(Time.prototype._fromMiliseconds(1).toString()).toBe([0, 0, 0, 0, 0, 1].toString());
        expect(Time.prototype._fromMiliseconds(1000).toString()).toBe([0,0,0,0,1,0].toString());
        expect(Time.prototype._fromMiliseconds(60_000).toString()).toBe([0,0,0,1,0,0].toString());
        expect(Time.prototype._fromMiliseconds(99_000).toString()).toBe([0,0,0,1,39,0].toString());
        expect(Time.prototype._fromMiliseconds(259_299_000).toString()).toBe([0,3,0,1,39,0].toString());
        expect(Time.prototype._fromMiliseconds(31_536_000_000).toString()).toBe([1,0,0,0,0,0].toString());
        expect(Time.prototype._fromMiliseconds(31_536_000_005).toString()).toBe([1,0,0,0,0,5].toString());

    })
})

