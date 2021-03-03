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

    describe('parsing with letter notation', () => {
        it('days', () => {
            expect(new Time('10d').days).toBe(10);
        });
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
    });

    describe('no negative support', () => {

        const ERROR_MSG = /negatives are not supported/

        it('disallows negative Time', () => {
            expect(() => {
                new Time('-4:00');
            }).toThrow(ERROR_MSG)
        });

        it('disallows negatives in addition', () => {
            expect(() => {
                new Time('4:00').add('-1s')
            }).toThrow(ERROR_MSG);
        });

        it('disallows negatives in subtraction', () => {
            expect(() => {
                new Time('4y').subtract(-10000)
            }).toThrow(ERROR_MSG);
        });

        it('disallows negatives in gt', () => {
            expect(() => {
                new Time('4y').gt('-4d5w2s')
            }).toThrow(ERROR_MSG);
        });

        it('disallows negatives in gte', () => {
            expect(() => {
                new Time('4y').gte('-4d5w2s')
            }).toThrow(ERROR_MSG);
        });

        it('disallows negatives in lt', () => {
            expect(() => {
                new Time('4y').lt('-10:00:00.999')
            }).toThrow(ERROR_MSG);
        });

        it('disallows negatives in lte', () => {
            expect(() => {
                new Time('4y').lte('-9')
            }).toThrow(ERROR_MSG);
        });

    });

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

        it('can subtract from another Time instance', () => {
            const time = new Time('10:00:01.500');
            time.subtract(':01');
            expect(time.seconds).toBe(0);
            time.subtract('.600');
            expect(time.milliseconds).toBe(900);
            expect(time.seconds).toBe(59);
            expect(time.minutes).toBe(59);
            expect(time.hours).toBe(9);
        });


        it('can handle large overflows', () => {
            const time = new Time();
            time.add(new Time(86400000));
            expect(time.milliseconds).toBe(0);
            expect(time.minutes).toBe(0);
            expect(time.hours).toBe(0);
            expect(time.days).toBe(1);
        });

        it('can handle lange underflow', () => {
            const time = new Time('1d');
            time.subtract(86400000);
            expect(time.days).toBe(0);
            expect(time.hours).toBe(0);
            expect(time.minutes).toBe(0);
            expect(time.milliseconds).toBe(0);
        });

        // TODO all below, compare negative, and pos/neg mix
        it('can compare greaterThans', () => {
            const minute = new Time('1m');
            const hour = new Time('1h');
            expect(minute.gt(hour)).toBe(false);
            expect(hour.gt(minute)).toBe(true);
            expect(hour.gt('1:00:00')).toBe(false);
            expect(minute.gt('0.999')).toBe(true);
        });
        it('can compare greater-than-or-equals', () => {
            const time = new Time(10000);
            expect(time.gte(time)).toBe(true);
        });
        it('can compare less-than', () => {
            const time = new Time('1y10d4h30m1s');
            expect(time.lt('2y')).toBe(true);
            expect(time.lt('1y9d20h30m1s')).toBe(false);
        });
        it('can compare less-than-equal', () => {
            const time = new Time(600);
            expect(time.lte(600)).toBe(true);
            expect(time.lte(599)).toBe(false);
        });
        it('can compare with equal', () => {
            const time1 = new Time('99d12h44ms');
            const time2 = new Time('99:12:00:00.044');
            expect(time1.equals(time2)).toBe(true);
            expect(time2.equals(time2)).toBe(true);
            expect(time2.equals(time2)).toBe(true);
            expect(time1.equals(time1)).toBe(true);
            expect(time1.equals(0)).toBe(false);
        })
    });

    xdescribe('negatives parsing', () => {
        it('_days (negative)', () => {
            expect(new Time('-10d').days).toBe(-10);
        });
        it('_hours (negative)', () => {
            expect(new Time('-3h').hours).toBe(-3);
        });
    });

    xdescribe('negative math functions', () => {
        // TODO: Enable when negatives are supported

        it('can add two negatives', () => {
            const time = new Time('-5d1m');
            time.add('-1d4h5m');
            expect(time.days).toBe(-6);
            expect(time.hours).toBe(-4);
            expect(time.minutes).toBe(-6);
        });

        it('can add negatives to positives', () => {
            const time = new Time('5:00:00');
            time.add('-10:2:59');
            expect(time.seconds).toBe(-1)
            expect(time.minutes).toBe(-57);
            expect(time.hours).toBe(-6);
        });

        it('can subtract two negatives', () => {
            const time = new Time('-5d6h');
            time.subtract('-7h');
            expect(time.days).toBe(-4);
            expect(time.hours).toBe(-23);
        });

        it('can subtract negative from positive', () => {
            const time = new Time('1y500ms');
            time.subtract('-500ms');
            expect(time.milliseconds).toBe(0);
            expect(time.seconds).toBe(1);
            expect(time.minutes).toBe(0);
            expect(time.hours).toBe(0);
            expect(time.days).toBe(0);
            expect(time.years).toBe(1)
        });

        it('can subtract positive from negative', () => {
            const time = new Time('-30:15:15.555'); // 1d6h15m15s555ms
            time.subtract('45:00.445');
            expect(time.milliseconds).toBe(-0);
            expect(time.seconds).toBe(-16);
            expect(time.minutes).toBe(-0);
            expect(time.hours).toBe(-7)
        });
    });

    xdescribe('negative time values', () => {
        it('can be negative', () => {
            const time = new Time(-10);
            expect(time.milliseconds).toBe(-10);
        });
        it('can be negative from string', () => {
            const time = new Time('-10h3m');
            expect(time.hours).toBe(-10);
            expect(time.minutes).toBe(-3);
        });
        it('can go from negative to positive', () => {
            const time = new Time('-5:00');
            time.add('6:30');
            expect(time.minutes).toBe(1);
            expect(time.seconds).toBe(30);
        });
        it('can go from positive to negative', () => {
            const time = new Time('364d23h59m59s999ms'); // 1ms short of 1y
            time.subtract('1y');
            expect(time.milliseconds).toBe(-1);
            expect(time.minutes).toBe(-0);
            expect(time.seconds).toBe(-0);
            expect(time.hours).toBe(-0);
            expect(time.days).toBe(-0);
            expect(time.years).toBe(-0);
        });

        it('works with add', () => {
            const time = new Time('-10:44');
            time.add(':45');
            expect(time.minutes).toBe(-9);
            expect(time.seconds).toBe(-59);
        })
    })

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

        it('on _hours carries over', () => {
            const time = new Time(0);
            time.hours = 47;
            expect(time.hours).toBe(23);
            expect(time.days).toBe(1);
        })
        it('on _days carries over', () => {
            const time = new Time(0);
            time.days = 365;
            expect(time.years).toBe(1);
            expect(time.milliseconds).toBe(0);
            expect(time.seconds).toBe(0);
            expect(time.minutes).toBe(0);
            expect(time.hours).toBe(0);
            expect(time.days).toBe(0);
        })
    });

    it('_fromMilliSeconds returns arrays of numbers from milliseconds', () => {
        expect(Time.prototype._fromMilliseconds(1).toString()).toBe([0, 0, 0, 0, 0, 1].toString());
        expect(Time.prototype._fromMilliseconds(1000).toString()).toBe([0,0,0,0,1,0].toString());
        expect(Time.prototype._fromMilliseconds(60_000).toString()).toBe([0,0,0,1,0,0].toString());
        expect(Time.prototype._fromMilliseconds(99_000).toString()).toBe([0,0,0,1,39,0].toString());
        expect(Time.prototype._fromMilliseconds(259_299_000).toString()).toBe([0,3,0,1,39,0].toString());
        expect(Time.prototype._fromMilliseconds(31_536_000_000).toString()).toBe([1,0,0,0,0,0].toString());
        expect(Time.prototype._fromMilliseconds(31_536_000_005).toString()).toBe([1,0,0,0,0,5].toString());

    });

    describe('toString', () => {
        it('renders toString format [YY:[dd:[HH:[MM:]ss.mmm', () => {
           expect(new Time('3').toString()).toBe('03.000');
           expect(new Time('500ms').toString()).toBe('00.500');
           expect(new Time('3m').toString()).toBe('03:00.000');
           expect(new Time('4:01.05').toString()).toBe('04:01.050');
           expect(new Time('0').toString()).toBe('00.000');
           expect(new Time('999y').toString()).toBe('999:00:00:00:00.000');
           expect(new Time('364d23h59m59s999ms').toString()).toBe('364:23:59:59.999');
        });
    });
})

