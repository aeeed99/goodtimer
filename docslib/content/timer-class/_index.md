---
title: "The Timer Class"
date: 2021-04-17T10:35:28-04:00
weight: 2
pre: "<b>✽ </b>"
---


`Timer` is an extension of `Time`, it inherits all methods and properties, and additionally has a "count down" loop
and comes with many useful methods you'd expect from a timer. It's the main feature of goodtimer.

`Timer`'s first argument is required, which is a [`timeExpression`](../time-expressions), all other arguments are optional. If the last
argument is an object, it is assumed to be the [`timerOptions`](../timer-options), which can be used to override default behaviors of
the `Timer` instance

```javascript
// without timerOptions
new Timer(timeExpression);
new Timer(timeExpression, onTimeoutFn);
new Timer(timeExpression, onTimeoutFn, onIntervalFn);

// with timerOptions
new Timer(timeExpression, timerOptionsObj);
new Timer(timeExpression, onTimeoutFn, timerOptionsObj);
new Timer(timeExpression, onTimeoutFn, onIntervalFn, timerOptionsObj);
```

goodtimer automatically can tell which format you're trying to use based on the types of the arguments passed.

### Callback function with `Timer`

It will usually be desirable to have a function called when the timer reaches zero. It might also be handy to have a
function called on every second (or "tick") of the timer, for example when you need to update a UI element with the
new time remaining. `onTimeoutFn` and `onIntervalFn` arguments handle this.

```javascript
// onTimeout example

const timesUp = () => {
    // your code here
    console.log('ding!');
}

new Timer('5:00', timesUp);

// ~ 5 minutes later ~
// "ding!"
```

{{% notice note %}}

**In version 3.3.0 and above**, both callback functions can access the timer instance as their first argument.
It's especially useful in `onIntervalFn` arguments (See [v3.2.0 docs](https://github.com/nickpalenchar/goodtimer/tree/c9d7d54d2df91f0e3aae0b000d32d88d130b0e89#callback-function-with-timer) for previous syntax).
{{% /notice %}}

```javascript
const updateDOM = (timer) => {
    // this function updates the DOM with the time seperated by colons
    // with the smallest unit of time seconsd ('s'). This removes the milliseconds ('.000') at the end.
    document.getElementById('my-timer').innerText = timer.toString('s');
}

new Timer('5:00', timesUp, updateDOM);
```

If you want to only use an `onIntervalFn`, and not an `onTimeoutFn`, you can pass `undefined` or `null` as the
middle argument. You could alternatively use `TimerOptions` object to set these (and more).

```javascript
// both lines have the same effect.

new Timer('5:00', null, updateDOM);
new Timer('5:00', {onInterval: updateDOM});
```

##### See More:

{{% children %}}
