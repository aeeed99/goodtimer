<br/>
<div id="top" align="center"><img src="https://img.shields.io/npm/v/goodtimer.svg?style=flat-square&color=74B559"> <img src="https://img.shields.io/npm/dw/goodtimer?style=flat-square&color=2f6e59"> <img alt="Snyk Vulnerabilities for GitHub Repo" src="https://img.shields.io/snyk/vulnerabilities/npm/goodtimer?color=74B559&style=flat-square"></div>
<img src="./assets/logo.png" alt="logo">
<h3 align="center"><em>The Split-Second Precise JavaScript Timer</em></h3>

---

![goodtimer demo](assets/example1.gif)

## 🧐 About

Goodtimer provides an accurate-to-milliseconds way of implementing `setTimeout` and `setInterval`. It's the timer of your
dreams, providing a high-level API to easily manipulate countdowns. Here's a few things that make Goodtimer so good:

* It self-corrects delays from the event loop, so it's guaranteed to stay in sync with time.
* It comes with a flexible [`timeExpression`](#timeexpressions) syntax, so you can easily express time in a number of desirable ways.
* Provides [drop-in replacement](docs/timeutil.md) to `setInterval`. 
* Can be used in projects like react with npm, or directly in the browser via [cdn](https://cdn.nickpal.to/goodtimer);

## Installation & simple usage

Download using [npm](https://npmjs.org/package/goodtimer)

```shell
npm i --save goodtimer
```

And use in your code!

```javascript
const { Timer } = require('goodtimer');

new Timer('1:00');
```

Or replace your drifty `setInterval`s with `setGoodInterval` ⭐️:

```javascript
const { setGoodInterval } = require('goodtimer').timeutil;

setGoodInterval(() => console.log("exactly 1 second!"), 1000);
```

#### 💝 _Browser-compatible client-side version now available!_

```html
<script src="https://cdn.nickpal.to/goodtimer/goodtimer-3.3.0.js"></script>
<script>
  new goodtimer.Timer('1:00');
</script>
```

➡️ Jump into the full docs site [here](https://goodtimer.dev) or read below for a few more quick examples :bow:

---

## ⏲ Simple Usage

```javascript
const yourFn = () => {};
new Timer('1:00', yourFn); // replacement for setTimeout
new Timer('1:00', yourFn, { repeat: true }); // replacement for setInterval

const timer = new Timer('5:00'); // (Five minutes)
timer.pause();         // freezes timer at given time
timer.unpause();       // resumes timer
timer.reset();         // resests to initial value (in this case 5 minutes)
timer.toString()       // returns in UTC-like format ("5:00.000")
// ~ 1 second later ~
timer.fmtTime("%M minutes %s seconds") // -> "4 minutes 59 seconds" (many ways to use!) 
timer.gt('1:00');      // "greater than" -> true
timer.lt('60:00:00');  // "less than (60 hrs)" -> true
timer.equals('6m');    // (6 minutes, alternate notation) -> false

// or use the Time class and skip the controls
const [minute, second] = [new Time('1m'), new Time('1s')];

minute.gt(second)        // -> true
second.equals(':01')     // -> true
minute.equals(second)    // -> false
second.set(minute)       // set to new value
minute.equals(second)    // -> true
minute.toString()        // -> "1:00.000"

// `timeExpressions` are passed to Time or Timer, and can be an
// object, number, array, or string (in multiple formats)
// below are all the ways to write "25 minutes and 500 milliseconds"

new Time('25:00.5'); // string in UTC-like syntax
new Time('25m500ms'); // string with unit annotation
new Time(1500500);  // number for milliseconds
new Time({          // object with full names
    minutes: 25, 
    milliseconds: 500 
});
```

Ready to jump in? See the [full Documentation site](https://goodtimer.dev) spec for many more uses and tutorials!

## :clap: Supporters

[![Stargazers repo roster for goodtimer](https://reporoster.com/stars/nickpalenchar/goodtimer)](https://github.com/nickpalenchar/goodtimer/stargazers)
[![Forkers repo roster for goodtimer](https://reporoster.com/forks/nickpalenchar/goodtimer)](https://github.com/nickpalenchar/goodtimer/network/members)

---
