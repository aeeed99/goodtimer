# timeutil

A package of functions that make working with time simple.

The only useful functions are `setGoodInterval` and `clearGoodInterval`, which are drop-in replacements for the [built-in `setInterval`/`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).

To use, require them in via the timeutil package and use the same way you would `setInterval`.

```javascript

const { setGoodInterval, clearGoodInterval } = require('goodtimer').timeutil;

let countdown = 5;
let countdownId;

const doCountdown = () => {
    if (countdown-- < 1 && countdownId) {
        console.log('Done!')
        clearGoodInterval(countdownId);
    }
    else {
        console.log(`${countdown}...`);
    }
}

countdownId = setGoodInterval(doCountdown, 1000);

// 4...
// 3...
// 2...
// 1...
// Done!

```