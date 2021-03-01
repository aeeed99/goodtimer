
interface Config {
    divider: string;
    devMode: boolean;
}

/**
 * @param TimerOptions.divider what [[Timer.getFullTimeUI]] uses to separate each unit of time. Default ":"
 * @param TimerOptions.immediateInterval when `true`, the timer ticks down by one immediately, and the `onInterval` function runs, if passed.
 * @param TimerOptions.onInterval how often the timer ticks down. E.g. `1` means the timer will tick by one second every second, `5` means it ticks down five seconds every 5 second. This affects how often [[TimerOptions.onInterval]] runs
 * @param TimerOptions.repeat if `true`, resets the timer to its original time, and begins counting down again
 * @param TimerOptions.onTimeout a function that's ran when the timer reaches 0
 * @param TimerOptions.startPaused if `true`, timer will start paused at its initial time, and must be unpaused to count down.
 */
interface TimerOptions {
    divider?: string; // default ":"
    immediateInterval?: boolean; // default false
    interval: number
    onTimeout?: Function;
    onInterval?: Function;
    repeat?: number; // default 0
    startPaused?: boolean;
}

/**
 * The main timer class.
 *
 * Example:
 * ```javascript
 * new Timer('3:00', () => console.log('Time\'s up'));
 * ```
 *
 * See {@link Timer.constructor} for more uses
 */
class Timer {

    protected _mills: number[];
    protected _secs: number[];
    protected _mins: number[];
    protected _hours: number[];
    protected _days: number[];
    protected _years: number[];
    /**
     * Starting time of the timer. Other methods, such as [[Timer.reset]] uses this as its target to reset to.
     */
    initialTime: string;
    options: TimerOptions = {
        divider: ":",
        repeat: 0,
        immediateInterval: false,
        interval: 1
    };
    /**
     * whether or not the timer is paused.
     */
    isPaused: boolean = false;
    protected  remainingSec: number; // when pausing, the amount of milliseconds remaining before the next tick.
    /**
     * the id of the underlying setInterval, which controls the countdown "ticks". It's often unnessesar to use this.
     */
    intervalId: number | ReturnType<typeof setTimeout>; // id of the main loop for running this.tick
    protected lastTick: number; // Date in milliseconds marking the last tick (second) of the timer
    private _startMarker: number = -1;

    /**
     *
     * @param time The starting time to countdown from. Methods like [[Timer.reset]] uses this value as the inital time.
     * @param onTimeout function to run when the time reaches 0. `this` is the timer instance, allowing the function to call methods on the timer.
     * @param onInterval function to run on every interval (by default, every 1 second). Useful for updating UI elements.
     * @param options set various beheivors on the timer. Pass as an object as the 2nd argument.
     */
    constructor(time: string, onTimeout?: Function, onInterval?: Function, options?: TimerOptions);
    constructor(time: string, onTimeout?: Function, onInterval?: Function);
    constructor(time: string, onTimeout?: Function, options?: TimerOptions);
    constructor(time: string, options: TimerOptions);
    constructor(time: string, ...args) {
        this._mills = [0];
        this._secs = [0];
        this._mins = [0];
        this._hours = [0];
        this._days = [0];
        this._years = [0];
        this.setFromString(time);
        this.initialTime = time;
        this.adjustTime(0);

        // time, onTimeout, onInterval sig
        //TODO remove arguments object
        // 0 1 2
        if (typeof args[0] === 'function' && typeof args[1] === 'function') {
            this.options = {
                onTimeout: args[0],
                onInterval: args[1],
                ...(args[2] || {})
            }
        }
        else if (typeof args[0] === 'function') {
            // @ts-ignore
            this.options = {
                onTimeout: args[0],
                ...(args[1] || {})
            }
        }
        else if (typeof args[0] === 'object') {
            this.options = args[0];
        }
        this.isPaused = this.options.startPaused;
        this._startIntervalLoop(this.options.immediateInterval);
    }

    /**
     * Manually decrement the timer by its interval (by default 1 second), triggering the [[Timer.onInterval]] if defined, unless paused.
     * @param force do this even if paused (timer will still remain paused)
     */
    tick(force: boolean = false) {
        /** The main loop on the timer. **/
        // if an interval triggers a tick that was supposed to stop (due to quickly pausing again), it's ignored completely;
        // the same tick will rerun when the timer correctly resumes
        if(this.isPaused && !force) {
            return;
        }

        this.lastTick = Date.now();
        // Edge Case: timer with interval > 1 may pass "timesUp" (all 0's) rather than land on it.
        // When only seconds remain and are less than interval, adjust to be the interval exactly to get to 0.
        if(!this._years[0] && !this._days[0] && !this._hours[0] && !this._mins[0] && this._secs[0] < this.options.interval) {
            this._secs[0] = this.options.interval;
        }

        this.adjustTime(-this.options.interval);

        if(!this._years[0] && !this._days[0] && !this._hours[0] && !this._mins[0] && !this._secs[0]) {
            //TODO: Will there ever be millisecond remaining? Should a timeout be set here in that case?
            // or will _mills always be 0 (and the case is handled on a resume)
            this.options.onTimeout && this.options.onTimeout.call(this);
            if (this.options.repeat) {
                this.options.repeat--;
                this.setFromString(this.initialTime);
            }
            else {
                this.isPaused = true;
            }
        }
        else {
            this.options.onInterval && this.options.onInterval.call(this);
        }
    }

    /**
     * Flips the timer to paused if unpaused, and to unpaused if paused.
     */
    togglePause() {
        if (this.isPaused) {
            return this.unpause();
        }
        else {
            return this.pause();
        }
    }

    /**
     * Pauses the timer. If the timer is already paused, this has no effect.
     */
    pause() {
        if(this.isPaused) {
            return;
        }
        let timePaused = Date.now();
        this.isPaused = true;
        this.remainingSec = timePaused - this.lastTick;
        // @ts-ignore
        clearInterval(this.intervalId);
        return this.isPaused;
    }

    /**
     * Unpauses the timer. If the timer is already unpaused, this has no effect.
     */
    unpause() {
        if(!this.isPaused) {
            return;
        }
        this.isPaused = false;
        this.lastTick = Date.now(); // brings us back to current time since we last paused.
        setTimeout(function(){this._startIntervalLoop(true)}.bind(this), this.remainingSec);
        return this.isPaused;
    }

    protected _startIntervalLoop(initialTick?: boolean) {
        // the timer *can* be paused before 1 second passes, so it must be checked.
        if(this.isPaused) {
            return;
        }
        initialTick && this.tick();
        this.lastTick = Date.now();
        this.intervalId = setInterval(this.tick.bind(this), this.options.interval * 1000);
    }

    protected _parse(time: string): number[] {
        // TODO: this does NOT parse negative values. That is expected to be handled
        // by the instances _sign prop. A seperate parseTime for the client should
        // be created, which applies the _sign as appropriate after the initial parsing.
        if (/[dshmy]+/.test(time)) {

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
            throw TypeError("Cannot _parse string as time.")
        }
    }

    /**
     * Change the timer to a given string.
     * @param time an expression of a time.
     */
    setFromString(time: string): void {
        [this._years, this._days, this._hours, this._mins, this._secs, this._mills] = this._parse(time).map(i => [i])
    }

    protected adjustTime(seconds: number = -1) {
        /** Adjusts time by a number of seconds. Pass negative number to decrement.
         */
        const {adjustAndCarry: aac} = this;

        aac(this._years, Infinity,
            aac(this._days, 364,
                aac(this._hours, 23,
                    aac(this._mins, 59,
                        aac(this._secs, 59, seconds)))))
    }

    protected adjustAndCarry(num: number[], resetValue: number, interval: number): number {

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

    /**
     * Resets the timer back to its initial time. [[Timer.onTimeout]] does not get called.
     *
     * Does not change whether the timer is paused or not.
     */
    reset() {
        this.setFromString(this.initialTime);
    }

    /**
     * Like [[Timer.reset]], but unpauses the timer as well.
     */
    restart() {
        this.reset();
        this.unpause();
    }

    //// UI-Functions ////
    protected _addPadding(number: number, zeros: number): string {
        let value = String(number);
        // @ts-ignore
        return "0".repeat(Math.max(zeros - value.length, 0)) + value;
    }
    protected _timeAsArray(): number[] {
        return [this._years[0], this._days[0], this._hours[0], this._mins[0], this._secs[0], this._mills[0]];
    }

    getMillisecondsUI(padding) {
        const dateOffset = this.lastTick ? Date.now() - this.lastTick : 0;
        return this._addPadding(dateOffset + this._mills[0], padding);
    }
    getSecondsUI(padding: number = 2) {
        return this._addPadding(this._secs[0], padding);
    }
    getMinutesUI(padding) {
        return this._addPadding(this._mins[0], padding);
    }
    getHoursUI(padding) {
        return this._addPadding(this._hours[0], padding);
    }
    getDaysUI(padding) {
        return this._addPadding(this._days[0], padding);
    }
    getYearsUI(padding) {
        return this._addPadding(this._years[0], padding);
    }
    getFullTimeUI(includeMilliseconds = false) {
        let started = false;
        let result = [];
        let pad = this._addPadding;

        if (this._years[0]) {
            started = true;
            result.push(this._years[0])
        }
        if (this._days[0] || started) {
            started = true;
            result.push(this._days[0]);
        }
        if (this._hours[0] || started) {
            started = true;
            result.push(pad(this._hours[0], 2));
        }
        if (this._mins[0] || started) {
            started = true;
            result.push(pad(this._mins[0], 2));
        }
        result.push(pad(this._secs[0],2));

        if(includeMilliseconds) {
            result.push(pad(this._mills[0], 2));
        }
        return result.join(this.options.divider);
    }

    /**
     * Formats the current time as a string, depending on the value of fmt.
     *
     * @param fmt a template string that will be used to populate with time values.
     *
     * fmtTime looks for special characters in the string that start with `%`, depending on the next value, fmtTime will replace it with the following
     *
     * `%Y` - years
     * `%D` - days
     * `%H` - hours
     * `%M` - minutes
     * `%S` - seconds
     * `%m` - milliseconds
     * `%n` where n is a number,  format the following token to be padded with n zeros if all places can't be filled. E.g. a timer with 5 seconds left, the string `"%2%S"` will render as `"05"`
     */
    fmtTime(fmt: string = "%Y:%D:%H:%M:%S.%m") {
        // %Y - year
        // %D - Day
        // %H - hour
        // %M - minute
        // %S - second
        // %m - millisecond
        // %n - where n is number, next format token to be padded with n zeros.
        // %% - literal percent
        return fmt.replace(/%(\d)(%\w)/g, (p1, p2, p3) => this._addPadding(this.fmtTime(p3), +p2)).replace(/%Y/g, this.getYearsUI(0))
            .replace(/%D/g, this.getDaysUI(0))
            .replace(/%H/g, this.getHoursUI(0))
            .replace(/%M/g, this.getMinutesUI(0))
            .replace(/%S/g, this.getSecondsUI(0))
            .replace(/%m/g, this.getMillisecondsUI(0))
            .replace(/%%/g, '%');
    }

    getTime() {
        return this.fmtTime();
    }

    //// Functions for backwards compatibility with t-minus 1.0 ////
    resume = this.unpause;
    play = this.unpause;
    clearTimer() {
        console.warn("Deprecation Notice: goodtimer 2.x.x always clears the setInterval on pause." +
            " you can achieve the same effect by calling pause()");
        this.pause();
    }

}

try {
    // @ts-ignore
    module.exports = {Timer};
}
catch {
    // @ts-ignore
    window.goodtimer = {Timer}
}