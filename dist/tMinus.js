"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer = /** @class */ (function () {
    function Timer(time, fnOrOptions, onInterval) {
        this.options = {
            divider: ":",
            repeat: 0,
            immediateInterval: false,
            interval: 1
        };
        this.isPaused = false;
        this._startMarker = -1;
        //// Functions for backwards compatibility with t-minus 1.0 ////
        this.resume = this.unpause;
        this.play = this.unpause;
        this.mills = [0];
        this.secs = [0];
        this.mins = [0];
        this.hours = [0];
        this.days = [0];
        this.years = [0];
        this.setFromString(time);
        this.initialTime = time;
        this.adjustTime(0);
        // time, onTimeout, onInterval sig
        //TODO remove arguments object
        if (typeof fnOrOptions === 'function' || onInterval) {
            console.log('SETTING');
            // @ts-ignore
            this.options.onTimeout = fnOrOptions;
            this.options.onInterval = onInterval;
        }
        else if (typeof fnOrOptions === 'object') {
            this.options = __assign(__assign({}, this.options), fnOrOptions);
        }
        this.isPaused = this.options.startPaused;
        this._startIntervalLoop(this.options.immediateInterval);
    }
    Timer.prototype.tick = function (force) {
        if (force === void 0) { force = false; }
        /** The main loop on the timer. **/
        // if an interval triggers a tick that was supposed to stop (due to quickly pausing again), it's ignored completely;
        // the same tick will rerun when the timer correctly resumes
        if (this.isPaused && !force) {
            return;
        }
        this.lastTick = Date.now();
        // Edge Case: timer with interval > 1 may pass "timesUp" (all 0's) rather than land on it.
        // When only seconds remain and are less than interval, adjust to be the interval exactly to get to 0.
        if (!this.years[0] && !this.days[0] && !this.hours[0] && !this.mins[0] && this.secs[0] < this.options.interval) {
            this.secs[0] = this.options.interval;
        }
        this.adjustTime(-this.options.interval);
        if (!this.years[0] && !this.days[0] && !this.hours[0] && !this.mins[0] && !this.secs[0]) {
            //TODO: Will there ever be millisecond remaining? Should a timeout be set here in that case?
            // or will mills always be 0 (and the case is handled on a resume)
            this.options.onTimeout && this.options.onTimeout();
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
    };
    Timer.prototype.togglePause = function () {
        if (this.isPaused) {
            return this.unpause();
        }
        else {
            return this.pause();
        }
    };
    Timer.prototype.pause = function () {
        if (this.isPaused) {
            return;
        }
        var timePaused = Date.now();
        this.isPaused = true;
        this.remainingSec = timePaused - this.lastTick;
        clearInterval(this.intervalId);
        return this.isPaused;
    };
    Timer.prototype.unpause = function () {
        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;
        this.lastTick = Date.now(); // brings us back to current time since we last paused.
        setTimeout(function () { this._startIntervalLoop(true); }.bind(this), this.remainingSec);
        return this.isPaused;
    };
    Timer.prototype._startIntervalLoop = function (initialTick) {
        // the timer *can* be paused before 1 second passes, so it must be checked.
        if (this.isPaused) {
            return;
        }
        initialTick && this.tick();
        this.lastTick = Date.now();
        this.intervalId = setInterval(this.tick.bind(this), this.options.interval * 1000);
    };
    Timer.prototype.parse = function (time) {
        if (/[dsmy]+/.test(time)) {
            var valuesAtIndex = ['y', 'd', 'h', 'm', 's', 'ms'];
            var parsedTime = [null, null, null, null, null, null];
            var workingInt = '';
            for (var i = 0; i < time.length; i++) {
                if (/\d/.test(time[i])) {
                    workingInt += time[i];
                }
                else if (time[i] + time[i + 1] === 'ms') {
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
            return parsedTime.map(function (i) { return isNaN(parseInt(i)) ? 0 : parseInt(i); });
        }
        if (/(?:\d+:){0,4}\d+/.test(time)) {
            // colon separated syntax
            var _a = time.split('.'), others = _a[0], mils = _a[1];
            var parsed = others.split(/[^\d.]/).concat(mils);
            parsed = parsed.map(function (i) { return isNaN(parseInt(i)) ? 0 : parseInt(i); });
            while (parsed.length < 6) {
                parsed = [0].concat(parsed);
            }
            // TODO milliseconds
            return parsed;
        }
        else {
            throw TypeError("Cannot parse string as time.");
        }
    };
    Timer.prototype.setFromString = function (time) {
        var _a;
        _a = this.parse(time).map(function (i) { return [i]; }), this.years = _a[0], this.days = _a[1], this.hours = _a[2], this.mins = _a[3], this.secs = _a[4], this.mills = _a[5];
    };
    Timer.prototype.adjustTime = function (seconds) {
        if (seconds === void 0) { seconds = -1; }
        /** Adjusts time by a number of seconds. Pass negative number to decrement.
         */
        var aac = this.adjustAndCarry;
        aac(this.years, Infinity, aac(this.days, 364, aac(this.hours, 23, aac(this.mins, 59, aac(this.secs, 59, seconds)))));
    };
    Timer.prototype.adjustAndCarry = function (num, resetValue, interval) {
        var val = num[0] + interval;
        var carry = 0;
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
    };
    //// UI-Functions ////
    Timer.prototype._addPadding = function (number, zeros) {
        var value = String(number);
        // @ts-ignore
        return "0".repeat(Math.max(zeros - value.length, 0)) + value;
    };
    Timer.prototype._timeAsArray = function () {
        return [this.years[0], this.days[0], this.hours[0], this.mins[0], this.secs[0], this.mills[0]];
    };
    Timer.prototype.getMillisecondsUI = function (padding) {
        var dateOffset = this.lastTick ? Date.now() - this.lastTick : 0;
        return this._addPadding(dateOffset + this.mills[0], padding);
    };
    Timer.prototype.getSecondsUI = function (padding) {
        if (padding === void 0) { padding = 2; }
        return this._addPadding(this.secs[0], padding);
    };
    Timer.prototype.getMinutesUI = function (padding) {
        return this._addPadding(this.mins[0], padding);
    };
    Timer.prototype.getHoursUI = function (padding) {
        return this._addPadding(this.hours[0], padding);
    };
    Timer.prototype.getDaysUI = function (padding) {
        return this._addPadding(this.days[0], padding);
    };
    Timer.prototype.getYearsUI = function (padding) {
        return this._addPadding(this.years[0], padding);
    };
    Timer.prototype.getFullTimeUI = function (includeMilliseconds) {
        if (includeMilliseconds === void 0) { includeMilliseconds = false; }
        var started = false;
        var result = [];
        var pad = this._addPadding;
        if (this.years[0]) {
            started = true;
            result.push(this.years[0]);
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
        result.push(pad(this.secs[0], 2));
        if (includeMilliseconds) {
            result.push(pad(this.mills[0], 2));
        }
        return result.join(this.options.divider);
    };
    Timer.prototype.fmtTime = function (fmt) {
        var _this = this;
        // %Y - year
        // %D - Day
        // %H - hour
        // %M - minute
        // %S - second
        // %m - millisecond
        // %n - where n is number, next format token to be padded with n zeros.
        // %% - literal percent
        return fmt.replace(/%(\d)(%\w)/g, function (p1, p2, p3) { return _this._addPadding(_this.fmtTime(p3), +p2); }).replace(/%Y/g, this.getYearsUI(0))
            .replace(/%D/g, this.getDaysUI(0))
            .replace(/%H/g, this.getHoursUI(0))
            .replace(/%M/g, this.getMinutesUI(0))
            .replace(/%S/g, this.getSecondsUI(0))
            .replace(/%m/g, this.getMillisecondsUI(0))
            .replace(/%%/g, '%');
    };
    Timer.prototype.clearTimer = function () {
        console.warn("Deprecation Notice: t-minus 2.0 always clears the setInterval on pause." +
            " you can achieve the same effect by calling pause()");
        this.pause();
    };
    return Timer;
}());
exports.Timer = Timer;
//# sourceMappingURL=tMinus.js.map