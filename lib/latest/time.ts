/** @fileOverview a time class **/
import {type} from "os";


const { Timer } = require('./goodtimer');
const { parse } = Timer.prototype;

class Time {
    _time: Array<Array<number>> = [];

    constructor(time: number | string | Time) {
        if (typeof time === 'string') {
            this._time = parse(time).map(val => val === null ? [0] : [val]);
        }
        else if (typeof time === 'number') {

        }
    }

     _fromMiliseconds(num) {
        let result = [0, 0, 0, 0, 0, num];

        if (result[5] < 1000) {
            return result;
        }
        const seconds = (result[5] - (result[5] % 1000) ) / 1000
        result[5] %= 1000;
        result[4] = seconds;

        if(result[4] < 60) {
            return result;
        }
        const minutes = (seconds - (seconds % 60)) / 60;
        result[4] %= 60;
        result[3] = minutes;

        if(result[3] < 60) {
            return result
        }
        const hours = (minutes - (minutes % 60)) / 60;
        result[2] = hours;
        result [3] %= 60;

        if(hours < 24) {
            return result;
        }
        const days = (hours - (hours % 24)) / 24;
        result[1] = days;
        result[2] %= 24;

        if(result[1] < 365) {
            return result;
        }
        const years = (days - (days % 365)) / 365;
        result[0] = years;
        result[1] %= 365
        return result
    }
    // [years, days, hours, minutes, seconds, milliseconds]
    //  0      1     2      3        4        5
    get milliseconds() {
        return this._time[5][0];
    }
    set milliseconds(n) {
        this._time[5][0] = n;
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
        this._time[1][0] = n;
    }
    get days() {
        return this._time[0][0];
    }
    set days(n) {
        this._time[0][0] = n
    }

}


module.exports = {Time};