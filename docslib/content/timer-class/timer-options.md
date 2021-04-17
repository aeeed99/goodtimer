---
title: "TimerOptions"
date: 2021-04-17T10:57:43-04:00
weight: 4
---

Using an object you can provide an alternative way to declare `onTimeout` and `onInterval` functions, as well as
configuration for additional behavior. The full object properties are show below

```javascript
const timerOptions = {
    onTimeout: Function, // function to call when timer hits 0.
    onInterval: Function, // function to call on each second (or tick).
    repeat: Boolean | Number, // repeating beheivor after timer hits 0. (see notes)
    startPaused: Boolean, // if the timer should start counting down on creation or not (default false),
    immediateInterval: Boolean, // if the timer should tick once right when it's created (default false)
    interval: Number, // how many seconds before a tick (default 1, updating is uncommon)
    finalInterval: Boolean, // when timer runs out, only run onTimeout (if defined)
                            // otherwise calls onInterval followed by onTimeout.
  
    /* low-level loop control (https://github.com/nickpalenchar/goodtimer/tree/main/docs/setInterval-clearInterval.md) */
    setInterval: Function,
    clearInterval: Function
}
```

{{% notice warning %}}
**Prior to v3.1.0**, Timer never called `onInterval` when the timer reached 0. It now does the opposite by default.
for the old behavior, use `{ finalInterval: false }`, for your timerOptions.
{{% /notice %}}

##### Additional notes on options:

* **onTimeout/onInterval** - these should replace the functions passed as their own arguments. If you use both, only the
  functions in TimerOptions will be honored. `new Timer('3', functionA, { onTimeout: functionB })` will result in _only_
  `functionB` being called when the timer reaches zero.
* **repeat** - Specifically, when the timer reaches zero, if it has a repeat, it will reset back to its initial value
  and start the countdown again. Any `onTimeout` function is called before the reset.
    * Pass a number to make it only repeat a given number of times. `{ repeat: 2 }` mean it will repeat twice, and once
      it reaches zero again, it will stop and be paused at 0.
    * Pass a boolean to make it never or always repeat. `{ repeat: false }` means it never repeats (this is the default),
      `{ repeat: true }`, means it always repeats. This can also be written as `{ repeat: 0 }` or `{ repeat: Infinity }`
      for never and always repeating respectively.
* **startPaused** - means the timer will be created and paused at its starting time. Any `onInterval` function will not
  be called until unpaused. You must unpause it yourself with `timer.unpause()` or `timer.togglePause()`
* **immediateInterval** - Timer will immediately tick once when starting. `new Timer(`5:00`)`



