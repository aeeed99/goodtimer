// Functions for a personal timer.

var _copyArray = function(arr) {
  if(!Array.isArray(arr)) return;
  return arr.map(function(val){return val});
}
var _assignTimerFromArray = function (arr) {

}

var Timer = function (timer, fn, intervalFn) {

  if (Array.isArray(timer)) {
    debugger;
    timer.reverse();
    this.secs = parseInt(timer[0],10) || 0;
    this.mins = parseInt(timer[1],10) || 0;
    this.hrs =  parseInt(timer[2],10) || 0;
    this.days = parseInt(timer[3],10) || 0;

  } else if (typeof timer === 'string') {
    timer = timer.split(/\D/);
    return new Timer(timer, fn, intervalFn);
  }
  this.startPoint = _copyArray(timer);
  this.running = true;
  this.paused = false;

  // make sure any overflow of a unit is re-caluclated
  while(this.mins > 59) {
    this.hrs++;
    this.mins -= 60;
  }
  while (this.secs > 59) {
    this.mins++;
    this.secs -= 60;
  }

  this.interval = setInterval(
    (function () {
      debugger;
      if(this.paused) return;

      if (this.secs === 0) {
        if (this.mins === 0) {
          if(this.hrs === 0) {
            if(this.days === 0) {
              // time up function and remove listener
              clearInterval(this.interval);
              if (!fn || typeof fn !== 'function') {
                console.warn("Timer up. No function or invalid function passed for invokation");
              }
              else {
                fn();
              }
              clearInterval(this.interval);
              this.running = false;
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
      if (intervalFn) intervalFn();
    }).bind(this),
    1000);

  this.stop = () => {
    clearInterval(this.interval);
    this.running = false;
  }
};


Timer.prototype.getSecondsUI = function () {
  return this.secs < 10 ? '0' + this.secs : this.secs;
};
Timer.prototype.getMinutesUI = function () {
  return this.mins < 1 ? '0' : this.mins;
};
Timer.prototype.getTimerUI = function () {
  return "";
};
Timer.prototype.getTotal = function () {
  return this.mins * 60 + this.secs;
};

// timer functions
Timer.prototype.togglePause = function () {
  this.paused = !this.paused;
};
Timer.prototype.pause = function () {
  this.paused = true;
};
Timer.prototype.resume = Timer.prototype.play = function () {
  this.paused = false;
}
Timer.prototype.restart = function () {
  this;
};

try {
  if(module){
    module.exports = Timer;
  }
} catch(e){}
