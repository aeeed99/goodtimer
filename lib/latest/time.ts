/** @fileOverview a time class **/
import {type} from "os";


const { Timer } = require('./goodtimer');
const { parse } = Timer.prototype;

class Time {
    _time: Array<Array<number>> = [];

    constructor(time: number | string | Time = "0") {
        if (typeof time === 'number') {
            // @ts-ignore
            time = time.toString() + 'ms';
        }
        if (typeof time === 'string') {
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
    }

    add(time: number | string | Time): void {
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

        this.milliseconds = this.milliseconds - toSubtract.milliseconds;
        this.seconds = this.seconds - toSubtract.seconds;
        this.minutes = this.minutes - toSubtract.minutes;
        this.hours = this.hours - toSubtract.hours;
        this.days = this.days - toSubtract.days;
        this.years = this.years - toSubtract.years;
    }

    _adjustTime(milliseconds: number) {
        /** Adjusts time by a number of seconds. Pass negative number to decrement.
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

    _getCarryover(num, threshold) {
        /** Calculates the "carry-over", that is, how many whole units can be divided from a
         * threshold. This is used to calculate when, say, the seconds unit has more than allowed (60).
         * In that case, a number of "minutes" should be extracted from it (over the "threshold" of 60).
         */
        const carryover = (num - (num % threshold)) / threshold;
        const remaining = num % threshold;
        return [carryover, remaining];
    }

     _fromMiliseconds(num) {
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

    // [years, days, hours, minutes, seconds, milliseconds]
    //  0      1     2      3        4        5
    get milliseconds() {
        return this._time[5][0];
    }
    set milliseconds(n) {
        this._time[5][0] = n;
        if (this._time[5][0] >= 1000) {
            [this._time[4][0], this._time[5][0]] = this._getCarryover(this._time[5][0], 1000);
        }
        if (this._time[5][0] < 0) {
            if (this._time.slice(0, 5).some(el => el[0])) {
                const [carryOver, remainingInverse] = this._getCarryover(Math.abs(this._time[5][0]), 1000);
                this._time[5][0] = 1000 - remainingInverse;
                this._time[4][0] = this._time[4][0] - (carryOver + 1)
            }
        }
    }
    get ms() {
        /** Alias of .milliseconds. **/
        return this.milliseconds;
    }
    set ms(n) {
        this.milliseconds = n;
    }

    get seconds() {
        return this._time[4][0];
    }
    set seconds(n) {
        this._time[4][0] = n;
        if (this._time[4][0] >= 60) {
            [this._time[3][0], this._time[4][0]] = this._getCarryover(this._time[4][0], 60);
        }
    }
    get secs() {
        /** Alias of this#seconds **/
        return this.seconds;
    }
    set secs(n) {
        this.seconds = n
    }
    get minutes() {
        return this._time[3][0];
    }
    set minutes(n) {
        this._time[3][0] = n
        if (this._time[3][0] >= 60) {
            [this._time[2][0], this._time[3][0]] = this._getCarryover(this._time[3][0], 60);
        }
    }
    get mins() {
        /** Alias of .minutes **/
        return this.minutes;
    }
    set mins(n) {
        this.minutes = n;
    }
    get hours() {
        return this._time[2][0];
    }
    set hours(n) {
        this._time[2][0] = n;
        if (this._time[2][0] >= 24) {
            [this._time[1][0], this._time[2][0]] = this._getCarryover(this._time[2][0], 24);
        }
    }
    get days() {
        return this._time[1][0];
    }
    set days(n) {
        this._time[1][0] = n
        if (this._time[1][0] >= 365) {
            [this._time[0][0], this._time[1][0]] = this._getCarryover(this._time[1][0], 365);
        }
    }
    get years() {
        return this._time[0][0];
    }
    set years(n) {
        this._time[0][0] = n;
    }
}


module.exports = {Time};