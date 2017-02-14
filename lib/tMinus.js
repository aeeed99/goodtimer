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

  var Timer = function (timer, fn, intervalFn, options) {

    /// default options and override from param
    options = options || {};
    var divider = options.divider || DIVIDER;
    var immediateInterval = options.immediateInterval;
    options.UIPadding = options.UIPadding || {};
    var UIPaddingDay = options.UIPadding.day;
    var UIPaddingHour = options.UIPadding.hour;
    var UIPaddingMinute = options.UIPadding.minute;
    var UIPaddingSecond = options.UIPadding.second || true;
    Object.defineProperty(this, "protect", { value: options.protect, configurable: false, enumerable: false});

    if (Array.isArray(timer)) {
      timer.reverse();
      _assignTimerFromArray.call(this, timer);
    } else if (typeof timer === 'string') {

      timer = timer.split(/\D/).filter(function (t) {
        return t !== "";
      });
      return new Timer(timer, fn, intervalFn);
    }
    this.startPoint = _copyArray(timer);
    this._fn = fn;
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
    // thie intervalFn is called before at the "start" of each interval. To simulate this, call once immediately before `setInterval`
    if (this._intervalFn) this._intervalFn.call(this);
    this.interval = setInterval(_mainIntervalFn.bind(this, this._fn, this._intervalFn), 1000);

  };


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
    var divider = _divider || DIVIDER;
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

  (function(_global) {

    var DIVIDER = ":";
    var DEV_MODE = false // set this to true if you want helpful logs in your console

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
    }

    var Timer = function (timer, fn, intervalFn) {
      if (Array.isArray(timer)) {
        timer.reverse();
        _assignTimerFromArray.call(this, timer);
      } else if (typeof timer === 'string') {
        timer = timer.split(/\D/).filter(function (t) {
          return t !== "";
        });
        return new Timer(timer, fn, intervalFn);
      }
      this.startPoint = _copyArray(timer);
      this._fn = fn;
      this._intervalFn = intervalFn;
      this.isPaused = false;

      // make sure any overflow of a unit is re-caluclated
      while (this.mins > 59) {
        this.hrs++;
        this.mins -= 60;
      }
      while (this.secs > 59) {
        this.mins++;
        this.secs -= 60;
      }
      // thie intervalFn is called before at the "start" of each interval. To simulate this, call once immediately before `setInterval`
      if (this._intervalFn) this._intervalFn.call(this);
      this.interval = setInterval(_mainIntervalFn.bind(this, this._fn, this._intervalFn), 1000);

    };


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
      var divider = _divider || DIVIDER;
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
      this.interval = setInterval(_mainIntervalFn.bind(this, this._fn, this._intervalFn), 1000);
    };
    Timer.prototype.restart = function () {
      this.isPaused = false;
      this.reset();
    };
    Timer.prototype.clearTimer = function () {
      this.isPaused = true;
      clearInterval(this.interval);
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
    this.interval = setInterval(_mainIntervalFn.bind(this, this._fn, this._intervalFn), 1000);
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
    delete this;
  }

  //expose to the browser if available.
  if(_global) _global.Timer = Timer;

  //export as a module if available.
  try {
    if(module){
      module.exports = Timer;
    }
  } catch(e){}

})(window || self || null);
