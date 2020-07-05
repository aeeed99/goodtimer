# T-minus 🕚 🚀 [![npm](https://img.shields.io/npm/dm/t-minus.svg?maxAge=2592000)]() [![npm](https://img.shields.io/npm/v/t-minus.svg?maxAge=2592000)]()  [![npm](https://img.shields.io/npm/l/t-minus.svg?maxAge=2592000)]() [![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)]()
#### A lightweight JavaScript timer with count up/down directionality and custom function handling

`setInterval`/`setTimeout`s can be annoying. T-minus provides abstraction for various countdown features, both for logical uses and UI purposes.

T-minus can replace a `setTimeout`.

```javascript
new Timer(':30', () => console.log('30 seconds have passed'));
```

T-minus can display a countdown

```javascript
var el = document.getElementById('timer-element');

var timer = new Timer('2:00', {
    onInterval: function() {
        el.innerHTML = this.getTimerUI()
    }
});
```

T-minus has built-in pause functionality.
```javascript
var pauseBtn = document.getElementById('pauseBtn');

pauseBtn.addEventListener('click', function(){
  timer.togglePause();
  this.innerHTML = timer.isPaused ? "PLAY" : "PAUSE";
});
```

**And much more features including:**

* Repeatable timers.
* Units in miliseconds, minutes, hours, days, and even years!
* Customizable formats for displaying time.

Best of all its super lightweight, only **3.4KB** zipped and **0** dependencies 🧘‍

## Install
```shell
$ npm install t-minus
```
For Node/React:
```javascript
const { Timer } = require('t-minus');
```

In the browser using vanilla JS/HTML:

```html
<script href="path/to/t-minus/tMinus.js"></script>
<script>
var Timer = window.tMinus.Timer;
</script>
```

## Syntax
T-minus Timers have two signatures. The first for basic functionality and the second for more control:

```
new Timer(<time>,[<onTimeout>[,<onInterval>]]);
```
Where:

  + **time** _(required)_ `string | array ` - As a string, represents a time in DD:HH:MM:SS format. Eg. `40` for 40 seconds, `1:03` for 1 minute, 3 seconds, `1:00:00`, for ` hour`.
      + String can alternatively be labled. Eg `"40s"`, `"1m3s"`, `"1h"` for above times. See [time labels](#) for more info.
      + Note: The units in the time string can be separated by any character that is not a digit. And values do not have to be padded. The above examples can also work as `":40"` or `"1 0 0"`, among many others. 
      + As an Array, the signature is represented in \[DD,HH,MM,SS] format. Eg `[40]`, `[1,3]`, `[1,0,0]` for the above times.
  + **onTimeout** `function` - a function to invoke when the timer reaches 0.
  + **onInterval** `function` - a function to invoke on _every_ tick of the timer.

**function params and `this`** - The functions passed into `timerUpFn` and `intervalFn` are called with the timer object bound to `this`. You can call any method or get any property on `this` that you could when creating a timer (see methods below)

> WARNING!!: If using `this` to access the bound timer, do not use fat arrow functions. 

## Syntax with TimerOptions.
Alternatively, you can set a time with an options object:

```
new Timer(<time>, <options>)
```

Where

* **options** - `object` - a set of `TimerOptions`, which can include the above `onTimeout`/`onInterval` functions, plus many more (see `TimerOptions` beloew)
    
### TimerOptions

The options you can set in the object are as follows:

+ **onTimeout** `function` - function to invoke when timer ends. Timer methods are bound to function via `this`
+ **onInterval** `function` - function to invoke when timer ends. Timer methods are bound to function via `this`
+ **divider** `string` _default_ `":"` - the characters used to seperate each unit of time when returning from `getTimerUI`
+ **immediateInterval** `bool` _default_ `true` - when an `onInterval` function is used, will be invoked immediately at time of instantiation. Set to false to invoke only after the first second passes.
+ **repeat** - `number` _default_ `0` - amount of times for timer to automatically reset after ending. Can be set to `Infinity` to always repeat.
+ **interval** `number` _default `1`_ - the number of seconds for each "tick". A tick decremts the timer's time by its interval, so `1` (the defaults), decrements 1 second every second. An interval of `5` decrements by 5 seconds every 5 seconds. This has implications on the `onInterval` funciton, which will only get called on the interval provided (not every second).
    + Timers cannot be negative. If a timer had less time than the interval provided (for example, `3` seconds but the interval was `5`), the next tick would set the time to `0`, and triggering the times up sequence, calling `onTimeout` if provided and pausing if not set to repeat.
 


### When a Timer ends

When a timer reaches :00 (0:00:00:00), two main things happen _in order_:
   1. The timer is paused (`isPaused = true`) if the timer is not set to repeat.
   2. the `timerUpFn` is invoked once.
   3. If the timer is set to repeat, the timer resets to its original countdown time (it is not paused).

If the timer has no repeat, it will remain paused until further action is taken. Note that because of the order, logic can be written into the `onTimeout` to unpause the timer, such as calling `this.restart()` within it.  

⚠️ Writing something like `this.resume()` in the `timerUpFn` will simply keep invoking the same function every second, with the timer always at `:00`.

If using advanced syntax, you can also just set `repeat` to `Infinity` in the options object.

# `Timer` properties

### `isPaused`
Whether or not the timer is paused. When true, the timer doesn't count down and no `intervalFn` or `timerUpFn` is invoked. The time it is paused at is saved.

# `Timer` methods

## UI Methods
These might be useful if you need to display the timer in a human friendly form.

### `.getTimerUI([separator:string|function])`
Returns a string representing the timer in human readable form. Each unit is separated by a colon, and usually has a zero in the tens digit when only a single digit exists (except for `days`)
Example: "20:00", "19:59", and "3:32:50:09" might be returned.

Can accept a string or a function that returns a string which will be used to seperate each unit instead of a colon.

### `.getDaysUI()|.getHoursUI()|.getMinutesUI()|.getSecondsUI()`
Returns a string representing the respective unit. Hours, Minutes, and Seconds gets a zero-padding, and always without a colon.
```javascript
var timer = new Timer("1:23:4:30");

timer.getDaysUI() // -> "1"
timer.getHoursUI() // -> "23"
timer.getMinutesUI() // -> "04"
timer.getSecondsUI() // -> "30
```

### `.getTotal`
Returns a _number_ representing the amount left in the timer, _in seconds_
```javascript
//ex. continued from above
timer.getTotal(); // -> 109470
```

### `.fmtTime`

Method for creating custom time formats. Given a string with metacharacters denoted by `%`, replaces them with a specific time value.
The different replacers are listed below:

* `%Y` - Years
* `%D` - Days
* `%H` - Hours
* `%M` - Minutes
* `%S` - Seconds
* `%m` - Milliseconds
* `%%` - A literal `%` character.
* `%n` - where `n` is a number 0-9 and is followed by a replacer, adds `n` zero-padding to the value of the replacer. e.g (`%3%S Seconds left` -> `"003 Seconds left")

## Functional methods

### `.pause()`
Sets the timer's value of `isPaused` to `true`.

### `.resume()`
Unpauses the timer (sets the value of `isPaused` to `false`)

### `.play()`
Alias of `.resume()`

### `.togglePause()`
Toggles the paused state of the timer, pausing it if unpaused, and unpausing it if paused.

**returns:** the new `isPaused` boolean.

### `.reset()`
Resets the timer to the time it was instantiated with. If the timer is paused when `.reset()` is invoked, the time will still reset, but will remain paused.

This method reinstantiates the timer with the same callback functions, so calling this on a timer that previously had `.clearTimer()` called on will still work.

### `.restart()`
Similar to `.reset()`, resets the timer while forcing it to run, regardless of whether it was paused or not.

This method reinstantiates the timer with the same callback functions, so calling this on a timer that previously had `.clearTimer()` called on will still work.

### ~`.clearTimer()`~ 
**[DEPRECATED]** In v2.x.x, alias of `.pause()`. T-minus v1 did not clear `setInterval` on pauses. Starting in this version, t-misun _always_ clears the `setInterval` on pause.

when `setInterval` is cleared via `.clearTimer()`, the timer will not work until it is reinstantiated with `.restart()` or `.reset()`. 

## Timer Defaults

While options can be set on each instance, you may want to change the defaults all together. Each option exists the `Timer.options` class which can be set manually.
```javascript
// eg
Timer.options.divider = "-";
// all timers created after this will return HH-MM-SS when calling getTimerUI by default.
```

## Examples

Alert the user in 5 seconds:

```javascript
var alertMe = new Timer(":05", () => console.log("Time's up!"));
```

Alert the user _every_ 5 seconds:
```javascript
var annoyMe = new Timer("5", function(){
    alert("This is the function that neeevvverr ennddds...");
    this.restart();
    });
```

Or
```javascript
function annoy() { alert("This function is used within the optoins object"); }

var annoyMe = new Timer("5", { onTimeout: annoy, repeat: Infinity });
```

Update the innerHTML of your view on each passing second, so that the user can anticipate when you are about to annoy them.
```javascript
var timerView = document.getElementById("timerView");
var timerWithUI = new Timer("1:05" // automatically detects 1 minute and 5 seconds.
        , function() {alert("timer done."}
        , function() {timerView.innerHTML = this.getTimerUI()} // the 3rd argument is a funtion invoked every second.
        );
```

# Thanks for checking out this project!

If you have any other suggestions, feel free to add a pull request or submit an issue. Please give this a ⭐️ if you find it useful!
