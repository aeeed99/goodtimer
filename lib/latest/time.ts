/** @fileOverview a time class **/
import {type} from "os";

const { Timer } = require('./goodtimer');
const { parse } = Timer.prototype;


class Time {
    _sign: -1 | 1 = 1;
    _time: Array<Array<number>> = [];

    constructor(time: number | string | Time = "0") {
        if (typeof time === 'number') {
            if (time < 0) {
                this._sign = -1;
                time = Math.abs(time);
            }
            // @ts-ignore
            time = time.toString() + 'ms';
        }
        if (typeof time === 'string') {
            if (/^[^\d\w]*-/.test(time)) {
                this._sign = -1;
                time = time.replace(/^([^\d\w]*)(-)(.*)$/, '$1$3');
            }
            this._time = parse(time).map(val => val === null ? [0] : [val]);
        }
        else if (typeof time === 'number') {

        }
        else if (time instanceof Time) {
            // todo
        }
        else {
            throw new TypeError("Can't parse type.");
        }
        this._adjustTime(0)
    }

    add(time: number | string | Time): void {
        if (this._sign === -1) {
            return this.subtract(time);
        }
        const toAdd = time instanceof Time ? time : new Time(time);

        this.milliseconds = this.milliseconds + toAdd.milliseconds;
        this.seconds = this.seconds + toAdd.seconds;
        this.minutes = this.minutes + toAdd.minutes;
        this.hours = this.hours + toAdd.hours;
        this.days = this.days + toAdd.days;
        this.years = this.years + toAdd.years;
    }

    subtract(time: number | string | Time): void {
        const toSubtract = time instanceof Time ? time : new Time(time);

        this.years = this._time[0][0] + (toSubtract._time[0][0] * this._sign);
        this.days = this._time[1][0] + (toSubtract._time[1][0] * this._sign);
        this.hours = this._time[2][0] + (toSubtract._time[2][0] * this._sign);
        this.minutes = this._time[3][0] + (toSubtract._time[3][0] * this._sign);
        this.seconds = this._time[4][0] + (toSubtract._time[4][0] * this._sign);
        this.milliseconds = this._time[5][0] + (toSubtract._time[5][0] * this._sign);
    }

    _adjustTime(milliseconds: number) {
        /** Adjusts time by a number of milliseconds. Pass negative number to decrement.
         */
        const {_adjustAndCarry: aac} = this;

        aac(this._time[0], Infinity,
            aac(this._time[1], 364,
                aac(this._time[2], 23,
                    aac(this._time[3], 59,
                        aac(this._time[4], 59,
                            aac(this._time[5], 999, milliseconds))))));
    }

    _adjustAndCarry(num: number[], resetValue: number, interval: number): number {

        let val: number = num[0] + interval;
        let carry: number = 0;

        while (val < 0) {
            val += (resetValue + 1);
            carry -= 1;
        }
        while (val > resetValue) {
            val -= (resetValue + 1);
            carry += 1;
        }
        num[0] = val;
        return carry;
    }

    _getCarryover(num, threshold): [number, number] {
        /** Calculates the "carry-over", that is, how many whole units can be divided from a
         * threshold. This is used to calculate when, say, the seconds unit has more than allowed (60).
         * In that case, a number of "minutes" should be extracted from it (over the "threshold" of 60).
         */
        const carryover = (num - (num % threshold)) / threshold;
        const remaining = num % threshold;
        return [carryover, remaining];
    }

     _fromMilliseconds(num: number) {
        let result = [0, 0, 0, 0, 0, num];

        if (result[5] < 1000) {
            return result;
        }
        [result[4], result[5]] = this._getCarryover(result[5], 1000);


        if(result[4] < 60) {
            return result;
        }
        [result[3], result[4]] = this._getCarryover(result[4], 60);
        const minutes = result[3];

        if(result[3] < 60) {
            return result
        }
        [result[2], result[3]] = this._getCarryover(result[3], 60);
        const hours = result[2];

        if(hours < 24) {
            return result;
        }
        [result[1], result[2]] = this._getCarryover(result[2], 24);
        const days = result[1];

        if(result[1] < 365) {
            return result;
        }
        [result[0], result[1]] = this._getCarryover(result[1], 365);
        return result
    }
    _adjustOverflow(place: number, threshold: number): number {
        /**
         * Sets the value at placemarker (value) to a positive number within its
         * threshold, adding to larger places if needed.
         *
         * If the value is within the threshold, nothing happens.
         */
        if (place === 0) {
            // the largest placement has no limit
            return 0;
        }
        if (this._time[place][0] >= threshold) {
            const [carryOver, remaining] = this._getCarryover(this._time[place][0], threshold);
            this._time[place][0] = remaining;
            return carryOver;
        }
        return 0;
    }

    _adjustUnderflow(place: number, threshold) {
        if (this._time[place][0] < 0) {
            if (this._time.slice(0, place).some(el => el[0])) {
                const [carryOver, remainingInverse] = this._getCarryover(Math.abs(this._time[place][0]), threshold);
                this._time[place][0] = threshold - remainingInverse;
                return  -(carryOver + 1);
            }
            // Arriving here, there are no further places to borrow from, and sign must flip
            this._sign *= -1;
            this._time[place][0] = Math.abs(this._time[place][0]);
        }
        return 0;
    }

    // [years, days, hours, minutes, seconds, milliseconds]
    //  0      1     2      3        4        5
    get milliseconds() {
        return this._time[5][0] * this._sign;
    }
    set milliseconds(n) {
        this._time[5][0] = n;
        const over = this._adjustOverflow(5, 1000);
        const under = this._adjustUnderflow(5, 1000);
        this.seconds = this._time[4][0] + over + under;
    }
    get ms() {
        /** Alias of .milliseconds. **/
        return this.milliseconds;
    }
    set ms(n) {
        this.milliseconds = n;
    }

    get seconds() {
        return this._time[4][0] * this._sign;
    }
    set seconds(n) {
        this._time[4][0] = n;
        const over = this._adjustOverflow(4, 60);
        const under = this._adjustUnderflow(4, 60);
        this.minutes = this._time[3][0] + over + under;
    }
    get secs() {
        /** Alias of this#seconds **/
        return this.seconds;
    }
    set secs(n) {
        this.seconds = n
    }
    get minutes() {
        return this._time[3][0] * this._sign;
    }
    set minutes(n) {
        this._time[3][0] = n
        const over = this._adjustOverflow(3, 60);
        const under = this._adjustUnderflow(3, 60);
        this.hours = this._time[2][0] + over + under;
    }
    get mins() {
        /** Alias of .minutes **/
        return this.minutes;
    }
    set mins(n) {
        this.minutes = n;
    }
    get hours() {
        return this._time[2][0] * this._sign;
    }
    set hours(n) {
        this._time[2][0] = n;
        const over = this._adjustOverflow(2, 24);
        const under = this._adjustUnderflow(2, 24);
        this.days = this._time[1][0] + over + under;
    }
    get days() {
        return this._time[1][0] * this._sign;
    }
    set days(n) {
        this._time[1][0] = n;
        const over = this._adjustOverflow(1, 365);
        const under = this._adjustUnderflow(1, 365);
        this.years = this._time[0][0] + over + under;
    }
    get years() {
        return this._time[0][0] * this._sign;
    }
    set years(n) {
        if (n < 0) {
            this._sign *= -1;
            n = Math.abs(n)
        }
        this._time[0][0] = n;
    }
}


module.exports = {Time};