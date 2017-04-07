# T-minus 🕚 🚀 [![npm](https://img.shields.io/npm/dm/t-minus.svg?maxAge=2592000)]() [![npm](https://img.shields.io/npm/v/t-minus.svg?maxAge=2592000)]()  [![npm](https://img.shields.io/npm/l/t-minus.svg?maxAge=2592000)]() [![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)]()
#### A lightweight JavaScript timer with count up/down directionality and custom function handling

`setInterval`/`setTimeout`s can be annoying. T-minus provides abstraction for various countdown features, both for logical uses and UI purposes.

## Examples

Alert the user in 5 seconds:

```
var alertMe = new Timer(":05",function(){ alert("5 seconds up!") });
```

Alert the user _every_ 5 seconds:
```
var annoyMe = new Timer("5",function(){
    alert("This is the function that neeevvverr ennddds...");
    this.restart();
    })
```

Or
```
function annoy() { alert("This function is used within the optoins object") }

var annoyMe = new Timer("5" { onTimeout: annoy, repeat: Infinity });
```

Update the innerHTML of your view on each passing second, so that the user can anticipate when you are about to annoy them.
```
var timerView = document.getElementById("timerView");
var timerWithUI = new Timer("1:05" // automatically detects 1 minute and 5 seconds.
        , function() {alert("timer done."}
        , function() {timerView.innerHTML = this.getTimerUI()} // the 3rd argument is a funtion invoked every second.
        );
```

T-minus has built-in pause functionality.
```
var pauseBtn = document.getElementById('pauseBtn');

pauseBtn.addEventListener('click', function(){
  timer.togglePause();
  this.innerHTML = timer.isPaused ? "PLAY" : "PAUSE";
});
```

## Install
```
$ npm install t-minus
```
For Node:
```
var Timer = require('t-minus');
```
In the browser, link to `t-minus/lib/tMinus.js`

You'll get the `Timer` object (on the window if using in the browser). Yay! 😁
 
## Syntax
T-minus Timers have two signatures. The first for basic functionality and the second for more control:

```
new Timer(<time>,[<timerUpFn>[,<intervalFn>]]);
```
Where:
  + **time** _(required)_ \<string|array> - As a string, represents a time in DD:HH:MM:SS format. Eg. `40` for 40 seconds, `1:03` for 1 minute, 3 seconds, `1:00:00`, for ` hour`.
      + String can alternatively be labled. Eg `"40s"`, `"1m3s"`, `"1h"` for above times. See [time labels](#) for more info.
      + Note: The units in the time string can be separated by any character that is not a digit. And values do not have to be padded. The above examples can also work as `":40"` or `"1 0 0"`, among many others. 
      + As an Array, the signature is represented in \[DD,HH,MM,SS] format. Eg `[40]`, `[1,3]`, `[1,0,0]` for the above times.
  + **timerUpFn** \<function> - a function to invoke when the timer reaches 0.
  + **intervalFn** \<function> - a function to invoke on _every_ tick of the timer.

**function params and `this`** - The functions passed into `timerUpFn` and `intervalFn` are called with the timer object bound to `this`. You can call any method or get any property on `this` that you could when creating a timer (see methods below)

#### Advanced Syntax.
Alternatively, you can set a time with an options object:

```
new Timer(<time>, <options>)
```
`options` has an `onTimeout` and `onInterval` property where the `timerUpFn` and `intervalFn` are passed in this syntax. See all options in the [timer options](#) section.

**end of a timer** - when a timer reaches :00 (0:00:00:00), two main things happen _in order_:
   1. The timer is paused (`isPaused = true`)
   2. the `timerUpFn` is invoked once.

The timer will remain paused until further action is taken upon it. Note that because of the order, logic can be written into the `timerUpFn` to unpause the timer, such as calling `this.restart()` within it. 

⚠️ Writing something like `this.resume()` in the `timerUpFn` will simply keep invoking the same function every second, with the timer always at `:00`.
If using advanced syntax, you can also just set `repeat` to `Infinity` in the options object.

### Stopwatch Functionality
Want the timer to count up instead of down? Omit the `<time>` argument in either syntax to begin counting up from 0.

```
new Timer([intervalFn]]);
```

Or using advanced syntax

```
new Timer(<options>);
```

#### Stopwatch examples

```
// count up from zero.
new Timer();

// count up from 0 and alert when 1 minute is reached
new Timer({ endTime: "1m", onTimeout: function(){ alert("1 minute reached"); });

// count up from 5 minutes and always reset after hitting 10 minutes
new Timer({ startTime: "5m", endTime: "10m", repeat: Infinity });
```


# `Timer` properties

### `isPaused`
Whether or not the timer is paused. When true, the timer doesn't count down and no `intervalFn` or `timerUpFn` is invoked. The time it is paused at is saved.

# `Timer` methods

### `.pause()`
Sets the timer's value of `isPaused` to `true`.

### `.resume()`
Unpauses the times (sets the value of `isPaused` to `false`)

### `.play()`
Alias of `.resume()`

### `.togglePause()`
Toggles the paused state of the timer.

### `.reset()`
Resets the timer to the time it was instantiated with. If the timer is paused when `.reset()` is invoked, the time will still reset, but will remain paused.

This method reinstantiates the timer with the same callback functions, so calling this on a timer that previously had `.clearTimer()` called on will still work.

### `.restart()`
Similar to `.reset()`, resets the timer while forcing it to run, regardless of whether it was paused or not.

This method reinstantiates the timer with the same callback functions, so calling this on a timer that previously had `.clearTimer()` called on will still work.

### `.clearTimer()`
Pauses the timer while clearing the `setInterval` that `new Timer` sets internally. Good for memory management.

when `setInterval` is cleared via `.clearTimer()`, the timer will not work until it is reinstantiated with `.restart()` or `.reset()`. 

## UI Methods
These might be useful if you need to display the timer in a human friendly form.

### `.getTimerUI([separator:string|function])`
Returns a string representing the timer in human readable form. Each unit is separated by a colon, and usually has a zero in the tens digit when only a single digit exists (except for `days`)
Example: "20:00", "19:59", and "3:32:50:09" might be returned.

Can accept a string or a function that returns a string which will be used to seperate each unit instead of a colon.

### `.getDaysUI()|.getHoursUI()|.getMinutesUI()|.getSecondsUI()`
Returns a string representing the respective unit. Hours, Minutes, and Seconds gets a zero-padding, and always without a colon.
```
var timer = new Timer("1:23:4:30");

timer.getDaysUI() // -> "1"
timer.getHoursUI() // -> "23"
timer.getMinutesUI() // -> "04"
timer.getSecondsUI() // -> "30
```

### `.getTotal`
Returns a _number_ representing the amount left in the timer, _in seconds_
```
//ex. continued from above
timer.getTotal() -> 109470
```

# Timer Options

Many aspects of a timer instance can be customized when using [advanced syntax](#). The options you can set in the object are as follows:

+ **onTimeout** \<function> - function to invoke when timer ends. Timer methods are bound to function via `this`
+ **onInterval** \<function> - function to invoke when timer ends. Timer methods are bound to function via `this`
+ **divider** \<string> _default_ `":"` - the characters used to seperate each unit of time when returning from `getTimerUI`
+ **immediateInterval** \<bool> _default_ `true` - when an `onInterval` function is used, will be invoked immediately at time of instantiation. Set to false to invoke only after the first second passes.
+ **repeat** - \<number> _default_ `0` - amount of times for timer to automatically reset after ending. Can be set to `Infinity` to always repeat.
+ "Stopwatch-only" options:
    + **startTime** - \<timeUnit> _default_ `"0"` - The time to start counting up from. Given as a time string or Array.
    + **endTime** - \<timeUnit> - The time the stopwatch ends, invoking the `onTimeout` function if passed.


## Timer Defaults

While options can be set on each instance, you may want to change the defaults all together. Each option exists the `Timer.options` class which can be set manually.
```
// eg
Timer.options.divider = "-";
// all timers created after this will return HH-MM-SS when calling getTimerUI by default.
```


# Thanks for checking out this project!

If you have any other suggestions, feel free to add a pull request or submit an issue. Please give this a ⭐️ if you find it useful!
