interface Config {
    divider: string;
    devMode: boolean;
}

interface TimerOptions {
    divider?: string; // default ":"
    immediateInterval?: boolean; // default true
    onTimeout?: Function;
    onInterval?: Function;
    repeat?: number; // default 0
}

export class Timer {

    mills: number[];
    secs: number[];
    mins: number[];
    hours: number[];
    days: number[];
    years: number[];
    options: TimerOptions = {
        divider: ":",
        repeat: 0,
        immediateInterval: true
    };

    constructor(time: string, onTimeout?: Function, onInterval?: Function);
    constructor(time: string, options: TimerOptions)
    constructor(time: string, fnOrOptions: Function | TimerOptions) {
        this.mills = [0];
        this.secs = [0];
        this.mins = [0];
        this.hours = [0];
        this.days = [0];
        this.years = [0];
        this.setFromString(time);
        this.adjustTime(0);

        // time, onTimeout, onInterval sig
        if (typeof fnOrOptions === 'function') {
            this.options.onTimeout = fnOrOptions;
            this.options.onInterval = arguments[2];
            return this;
        }
        if (typeof fnOrOptions === 'object') {
            this.options = {...this.options, ...fnOrOptions};
        }

    }

    parse(time: string): number[] {
        if (/[dsmy]+/.test(time)) {

            const valuesAtIndex = ['y', 'd', 'h', 'm', 's', 'ms'];
            let parsedTime = [null, null, null, null, null, null];
            let workingInt: string = ''

            for (let i = 0; i < time.length; i++) {
                if (/\d/.test(time[i])) {
                    workingInt += time[i];
                } else if (time[i] + time[i + 1] === 'ms') {
                    if (parsedTime[5] !== null) {
                        throw new SyntaxError("Duplicate token 'ms'");
                    }
                    parsedTime[5] = workingInt;
                    workingInt = '';
                    i++;
                }
                else if (/[dshmy]/.test(time[i])) {
                    if (parsedTime[valuesAtIndex.indexOf(time[i])] !== null) {
                        throw new SyntaxError("Duplicate token " + time[i]);
                    }
                    parsedTime[valuesAtIndex.indexOf(time[i])] = workingInt;
                    workingInt = '';
                }
                else {
                    throw new SyntaxError("Unexpected token " + time[i]);
                }
            }
            return parsedTime.map(i => isNaN(parseInt(i)) ? 0 : parseInt(i))
        }
        if (/(?:\d+:){0,4}\d+/.test(time)) {
            // colon separated syntax
            let [others, mils] = time.split('.')
            let parsed: any[] = others.split(/[^\d.]/).concat(mils);

            parsed = parsed.map(i => isNaN(parseInt(i)) ? 0 : parseInt(i));

            while (parsed.length < 6) {
                parsed = [0].concat(parsed);
            }
            // TODO milliseconds
            return parsed;

        } else {
            throw TypeError("Cannot parse string as time.")
        }
    }

    setFromString(time: string): void {
        [this.years, this.days, this.hours, this.mins, this.secs, this.mills] = this.parse(time).map(i => [i])
    }

    adjustTime(seconds: number = -1) {
        /** Adjusts time by a number of seconds. Pass negative number to decrement.
         */
        const {adjustAndCarry: aac} = this;

        aac(this.years, Infinity,
            aac(this.days, 364,
                aac(this.hours, 23,
                    aac(this.mins, 59,
                        aac(this.secs, 59, seconds)))))
    }

    adjustAndCarry(num: number[], resetValue: number, interval: number): number {

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

}
