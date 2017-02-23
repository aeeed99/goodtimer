// Functions for a personal timer.

(function(_global) {

  var DIVIDER = ":";
  var DEV_MODE = false; // set this to true if you want helpful logs in your console

  var _copyArray = function (arr) {
    if (!Array.isArray(arr)) return;
    return arr.map(function (val) {
      return val
    });
  };
  var _assignTimerFromArray = function (arr) {
    this.secs = parseInt(arr[0], 10) || 0;
    this.mins = parseInt(arr[1], 10) || 0;
    this.hrs = parseInt(arr[2], 10) || 0;
    this.days = parseInt(arr[3], 10) || 0;
  };
  var _addPadding = function (num, padLength) {
    num = num + '';
    var padding = padLength - num.length < 0 ? 0 : padLength - num.length;
    return "0".repeat(padding) + num;
  };

  var _mainIntervalFn = function (fn, intervalFn) {


    intervalFn = intervalFn || Timer.options.interval;
    if (this.isPaused) return;

    if (this.secs === 0) {
      if (this.mins === 0) {
        if (this.hrs === 0) {
          if (this.days === 0) {
            // time up function and remove listener: done before function calls in case user wants to change these.
            clearInterval(this.interval);
            this.isPaused = true;

            if (!fn || typeof fn !== 'function') {
              if (DEV_MODE) console.warn("[T-minus] Timer up. No function or invalid function passed for invokation");
            } else {
              fn.call(this);
            }

            if(this._repeat > 0) {
              this._repeat--;
              this.restart();
            }
            return;

          } else {
            // a day has passed
            this.days--;
            this.hrs = 23;
            this.mins = 59;
            this.secs = 59;
          }
        } else {
          // An hour has passed
          this.hrs--;
          this.mins = 59;
          this.secs = 59;
        }
      } else {
        // A minute has passed
        this.mins--;
        this.secs = 59;
      }
    } else {
      // A second has passed
      this.secs--;
    }
    if (intervalFn) intervalFn.call(this);
  };
  var _mainStopwatchIntervalFn = function(intervalFn){

    intervalFn = intervalFn || Timer.options.interval;
    if (this.isPaused) return;

    if (this.secs === 0) {
      if (this.mins === 0) {
        if (this.hrs === 0) {
          if (this.days === 0) {
            // time up function and remove listener: done before function calls in case user wants to change these.
            clearInterval(this.interval);
            this.isPaused = true;

            if (!fn || typeof fn !== 'function') {
              if (DEV_MODE) console.warn("[T-minus] Timer up. No function or invalid function passed for invokation");
            } else {
              fn.call(this);
            }

            if(this._repeat > 0) {
              this._repeat--;
              this.restart();
            }
            return;

          } else {
            // a day has passed
            this.days--;
            this.hrs = 23;
            this.mins = 59;
            this.secs = 59;
          }
        } else {
          // An hour has passed
          this.hrs--;
          this.mins = 59;
          this.secs = 59;
        }
      } else {
        // A minute has passed
        this.mins--;
        this.secs = 59;
      }
    } else {
      // A second has passed
      this.secs--;
    }
    if (intervalFn) intervalFn.call(this);
  };

  var _configureTimerForStopwatch = function(timer){
    timer
  };
  var Timer = function (timer, fnOrOptions, intervalFnArg, _asStopwatch) {

    if(typeof timer === 'function') return new Timer([0], null, timer, true);
    if(typeof timer === 'object') return new Timer(timer.startTime || [0], timer, null, true);
    //TODO: make this work for Stopwatch

    /// default options and override from param

    var options = typeof fnOrOptions === 'object' ? fnOrOptions : {},
      timeUpFn = typeof fnOrOptions === 'function' ? fnOrOptions : (options.onTimeout || Timer.options.onTimeout),
      intervalFn = options.onInterval || intervalFnArg || Timer.options.onInterval,
      immediateInterval = options.immediateInterval || Timer.options.immediateInterval;

    options.UIPadding = options.UIPadding || {};
    var UIPaddingDay = options.UIPadding.day,
      UIPaddingHour = options.UIPadding.hour,
      UIPaddingMinute = options.UIPadding.minute;

    this.divider = options.divider || Timer.options.divider;
    this._repeat = options.repeat || Timer.options.repeat || 0;


    ///* check to see if timer is in unit form *///

    if(/[dhms]/g.test(timer)){
      timer = timer.toLowerCase().match(/(\d+\w)/g);

      var lib = ['d','h','m','s'];
      var timerArray = [0,0,0,0];

      // test for proper syntax
      timer.forEach(function(unit){
        if(!/[mshd]/i.test(unit)){
          throw new SyntaxError("[tminus] unit-based timer must only have letters d, h, m, or s.");
        }
        var num = parseInt(unit.match(/\d+/)[0]);
        var _unit = unit.match(/\w$/)[0];

        timerArray[lib.indexOf(_unit)] += num;

      });

      timer = timerArray;

    }

    if (Array.isArray(timer)) {
      timer.reverse();
      _assignTimerFromArray.call(this, timer);
    } else if (typeof timer === 'string') {

      timer = timer.split(/\D/).filter(function (t) {
        return t !== "";
      });
      return new Timer(timer, fnOrOptions, intervalFnArg);
    }
    this.startPoint = _copyArray(timer);
    this._timeUpFn = timeUpFn;
    this._intervalFn = intervalFn;
    this.isPaused = false;

    // make sure any overflow of a unit is re-caluclated
    while (this.hrs > 23){
      this.hrs -= 24;
      this.days++;
    }
    while (this.mins > 59) {
      this.hrs++;
      this.mins -= 60;
    }
    while (this.secs > 59) {
      this.mins++;
      this.secs -= 60;
    }
    // the intervalFn is called before at the "start" of each interval. To simulate this, call once immediately before `setInterval`
    if (this._intervalFn && immediateInterval) this._intervalFn.call(this);
    this.interval = setInterval(_mainIntervalFn.bind(this, this._timeUpFn, this._intervalFn), 1000);

  };


  //*****************************************//
  //// Default options that can be changed ////
  //*****************************************//
  Timer.options = {
    divider: ":",
    immediateInterval: true,
    onMinute: null,
    onHour: null,
    onDay: null,
    onInterval: null
  };
  // aliases
  Timer.options.onSecond = Timer.options.interval;
  Timer.options.onMin = Timer.options.onMinute;
  Timer.options.onSec = Timer.options.onSecond = Timer.options.interval;


  //*****************************************//
  //// Methods                             ////
  //*****************************************//

  Timer.prototype.getSecondsUI = function () {
    return _addPadding(this.secs, 2);
  };
  Timer.prototype.getMinutesUI = function () {
    return (this.hrs || this.days) ? _addPadding(this.mins, 2) : this.mins + '';
  };
  Timer.prototype.getHoursUI = function () {
    return this.days ? _addPadding(this.hrs, 2) : this.hrs + '';
  };
  Timer.prototype.getDaysUI = function () {
    return this.days + '';
  };
  Timer.prototype.getTimerUI = function (_divider) {
    var divider = _divider || this.divider || Timer.options.divider;
    if(typeof divider === 'function') divider = divider();
    if(typeof divider !== 'string') {
      divider = DIVIDER;
      if(DEV_MODE)
        console.warn("[tMinus] Non-string provided for `getTimerUI`. Using default separator instead");
    }
    return "" + (this.days ? this.getDaysUI(this.days) + divider : "") +
      (this.hrs || this.days ? this.getHoursUI(this.hrs) + divider : "") +
      (this.mins || this.hrs || this.days ? this.getMinutesUI(this.mins) + divider : DIVIDER) +
      (this.secs ? this.getSecondsUI(this.secs) : "00");
  };
  Timer.prototype.getTotal = function () {
    return (this.days * 26400) + (this.hrs * 3600) + (this.mins * 60) + this.secs;
  };
// Functions for a personal timer.


// timer functions
  Timer.prototype.togglePause = function () {
    this.isPaused = !this.isPaused;
  };
  Timer.prototype.pause = function () {
    this.isPaused = true;
  };
  Timer.prototype.resume = Timer.prototype.play = function () {
    this.isPaused = false;
  };
  Timer.prototype.reset = function () {
    clearInterval(this.interval);
    _assignTimerFromArray.call(this, this.startPoint);
    if (this._intervalFn) this._intervalFn.call(this);
    this.interval = setInterval(_mainIntervalFn.bind(this, this._timeUpFn, this._intervalFn), 1000);
  };
  Timer.prototype.restart = function () {
    this.isPaused = false;
    this.reset();
  };
  Timer.prototype.clearTimer = function () {
    this.isPaused = true;
    clearInterval(this.interval);
  };
  Timer.prototype.destroy = function() {
    this.clearTimer();
    for(var k in this){
      delete this[k];
    }
  };

  //expose to the browser if available.
  if(_global) _global.Timer = Timer;

  //export as a module if available.
  try {
    if(module){
      module.exports = Timer;
    }
  } catch(e){}

})(window || self || null);
