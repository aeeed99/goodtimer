# T-minus 🕚 🚀 [![npm](https://img.shields.io/npm/v/t-minus.svg?maxAge=2592000)]()  [![npm](https://img.shields.io/npm/l/t-minus.svg?maxAge=2592000)]()
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
T-minus Timers take the following signature;
```
new Timer(<time>,[<timerUpFn>[,<intervalFn>]]);
```
Where:
  + **time** _(required)_ \<string|array> - As a string, represents a time in DD:HH:MM:SS format. Eg. `40` for 40 seconds, `1:03` for 1 minute, 3 seconds, `1:00:00`, for ` hour`
      + Note: The units in the time string can be seperated by any character that is not a digit. And values do not have to be padded. The above examples can also work as `":40"`, `"1&3"`, and `"1 0 0"`, among many others. 
      + As an Array, the signature is represented in [DD,HH,MM,SS] format. Eg `[40]`, `[1,3]`, `[1,0,0]` for the above times.
  + **timerUpFn** \<function> - a function to invoke when the timer reaches 0.
  + **intervalFn** \<function> - a function to invoke on _every_ tick of the timer.

**function params and `this`** - The functions passed into `timerUpFn` and `intervalFn` are called with the timer object bound to `this`. You can call any method or get any property on `this` that you could when creating a timer (see methods below)

**end of a timer** - when a timer reaches :00 (0:00:00:00), two main things happen _in order_:
   1. The timer is paused (`isPaused = true`)
   2. the `timerUpFn` is invoked once.

The timer will remain paused until further action is taken upon it. Note that because of the order, logic can be written into the `timerUpFn` to unpause the timer, such as calling `this.restart()` within it. 

⚠️ Writting something like `this.resume()` in the `timerUpFn` will simply keep invoking the same function every second, with the timer always at `:00`.

## `Timer` properties

### `isPaused`
Whether or not the timer is paused. When true, the timer doesn't count down and no `intervalFn` or `timerUpFn` is invoked. The time it is paused at is saved.

## `Timer` methods

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

### `.getTimerUI()`
Returns a string representing the timer in human readable form. Each unit is seperated by a colon, and usually has a zero in the tens digit when only a single digit exists (except for `days`)
Example: "20:00", "19:59", and "3:32:50:09" might be returned.

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
# Coming soon in v1.x.x

+ A count-up function!
+ An options object in the `Timer` class, allowing for more control over how the timer is displayed and functions by default.
+ More data-comparison specific getters.
+ Support for milliseconds

If you have any other suggestions, feel free to add a pull request or submit an issue. Please give this a ⭐️ if you find it useful!
