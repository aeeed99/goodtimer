interface Config {
    divider: string;
    devMode: boolean;
}

interface TimerOptions {
    divider?: string; // default ":"
    immediateInterval?: boolean; // default true
    interval: number
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
        immediateInterval: true,
        interval: 1
    };
    isPaused: boolean = false;
    remainingSec: number; // when pausing, the amount of milliseconds remaining before the next tick.
    intervalId: number; // id of the main loop for running this.tick
    lastTick: number; // Date in milliseconds marking the last tick (second) of the timer
    private _startMarker: number = -1;

    constructor(time: string, onTimeout?: Function, onInterval?: Function);
    constructor(time: string, options: TimerOptions)
    constructor(time: string, fnOrOptions?: Function | TimerOptions, onInterval?) {
        this.mills = [0];
        this.secs = [0];
        this.mins = [0];
        this.hours = [0];
        this.days = [0];
        this.years = [0];
        this.setFromString(time);
        this.adjustTime(0);

        // time, onTimeout, onInterval sig
        //TODO remove arguments object
        if (typeof fnOrOptions === 'function' || onInterval) {
            // @ts-ignore
            this.options.onTimeout = fnOrOptions;
            this.options.onInterval = onInterval;
        }
        else if (typeof fnOrOptions === 'object') {
            this.options = {...this.options, ...fnOrOptions};
        }

        this._startIntervalLoop();
    }

    tick() {
        /** The main loop on the timer. **/

        // if an interval triggers a tick that was supposed to stop (due to quickly pausing again), it's ignored completely;
        // the same tick will rerun when the timer correctly resumes
        if(this.isPaused) {
            return;
        }

        this.lastTick = Date.now();
        // Edge Case: timer with interval > 1 may pass "timesUp" (all 0's) rather than land on it.
        // When only seconds remain and are less than interval, adjust to be the interval exactly to get to 0.
        if(!this.years[0] && !this.days[0] && !this.hours[0] && !this.mins[0] && this.secs[0] < this.options.interval) {
            this.secs[0] = this.options.interval;
        }

        this.adjustTime(-this.options.interval);

        if(!this.years[0] && !this.days[0] && !this.hours[0] && !this.mins[0] && !this.secs[0]) {
            //TODO: Will there ever be millisecond remaining? Should a timeout be set here in that case?
            // or will mills always be 0 (and the case is handled on a resume)
            this.options.onTimeout && this.options.onTimeout();
            this.isPaused = true;
        }
        else {
            this.options.onInterval && this.options.onInterval();
        }
    }

    togglePause() {
        if (this.isPaused) {
            return this.unpause();
        }
        else {
            return this.pause();
        }
    }

    pause() {
        if(this.isPaused) {
            return;
        }
        let timePaused = Date.now();
        this.isPaused = true;
        this.remainingSec = timePaused - this.lastTick;
        clearInterval(this.intervalId);
        return this.isPaused;
    }

    unpause() {
        if(!this.isPaused) {
            return;
        }
        this.isPaused = false;
        this.lastTick = Date.now(); // brings us back to current time since we last paused.
        setTimeout(function(){this._startIntervalLoop(true)}.bind(this), this.remainingSec);
        return this.isPaused;
    }

    _startIntervalLoop(initialTick?: boolean) {
        // the timer *can* be paused before 1 second passes, so it must be checked.
        if(this.isPaused) {
            return;
        }
        initialTick && this.tick();
        this.lastTick = Date.now();
        this.intervalId = setInterval(this.tick.bind(this), this.options.interval * 1000);
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

    //// UI-Functions ////
    _addPadding(number: number, zeros: number): string {
        let value = String(number);
        // @ts-ignore
        return "0".repeat(Math.max(zeros - value.length, 0)) + value;
    }
    _timeAsArray(): number[] {
        return [this.years[0], this.days[0], this.hours[0], this.mins[0], this.secs[0], this.mills[0]];
    }
    getMillisecondsUI(padding) {
        return this._addPadding(Date.now() - this.lastTick + this.mills[0], padding);
    }
    getSecondsUI(padding: number = 2) {
        return this._addPadding(this.secs[0], padding);
    }
    getMinutesUI(padding) {
        return this._addPadding(this.mins[0], padding);
    }
    getHoursUI(padding) {
        return this._addPadding(this.hours[0], padding);
    }
    getDaysUI(padding) {
        return this._addPadding(this.days[0], padding);
    }
    getYearsUI(padding) {
        return this._addPadding(this.years[0], padding);
    }
    getFullTimeUI(includeMilliseconds = false) {
        let started = false;
        let result = [];
        let pad = this._addPadding;

        if (this.years[0]) {
            started = true;
            result.push(this.years[0])
        }
        if (this.days[0] || started) {
            started = true;
            result.push(this.days[0]);
        }
        if (this.hours[0] || started) {
            started = true;
            result.push(pad(this.hours[0], 2));
        }
        if (this.mins[0] || started) {
            started = true;
            result.push(pad(this.mins[0], 2));
        }
        result.push(pad(this.secs[0],2));

        if(includeMilliseconds) {
            result.push(pad(this.mills[0], 2));
        }
        return result.join(this.options.divider);
    }
    
    fmtTime(fmt: string) {
        // TODO
    }

    //// Functions for backwards compatibility with t-minus 1.0 ////

    resume = this.unpause;
    play = this.unpause;
    clearTimer() {
        console.warn("Deprecation Notice: t-minus 2.0 always clears the set interval on pause." +
            " you can achieve the same effect by calling pause()");
        this.pause();
    }

}
