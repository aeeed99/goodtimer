# `setInterval` and `clearInterval`

New in v3.2.x, two low-level options exist in `timerOptions` which overrides how the timer counts down. Usage is uncommon.

## Override the Timer loops with `setInterval` and `clearInterval`

The most likely usage of `setInterval`/`clearInterval` is with the JavaScript built-in functions of the same name. goodtimer 
v3.2.x uses a custom interval functions to control countdown loops, called `setGoodInterval` and `clearGoodInterval`. 
The functions guarantee countdowns will stay in sync with the system clock. Native `setInterval` causes drift, but can 
be used instead if still desired with the following syntax:

```javascript
new Timer('1m', { setInterval, clearInterval });
```

Note that because the properties are the same name as the desired functions, they can be conveniently set with [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#new_notations_in_ecmascript_2015)

⚠️ **CAUTION**: Do not set one of these properties without the other, as `clearInterval` needs to be able to properly
stop continuous execution of whatever is returned by `setInterval`.

### Reasons for overriding `set`/`clearGoodInterval`

As previously mentioned, using these options is rare, but some reasons for using the native interval functions include:

* You want goodtimer to behave exactly like versions 3.1.x and below, which used `setInterval`/`clearInterval`
* You are using jest [timer mocks](https://jestjs.io/docs/timer-mocks), which don't work with `setGoodInterval`
  (you should only override in testing code)
* You are running goodtimer in an environment where the system clock settings is likely to change.
* You are running goodtimer in an environment that doesn't have access to a system clock (specifically `Date.now()`)

## Using a custom looping function for setInterval

You can make your own function that loops a countdown (and clears one). To do so, make functions that do the following:

**Make a `setInterval` function**: It should take a callback function and a number to loop, in milliseconds. It must
return an `id` which can be passed to the custom `clearInterval` function, which will then stop the loop.

```
setIntervalFn(callback, timeout) -> id
```

**Make a `clearInterval` function**: It should take the `id` returned by the `setInterval` function.

```
clearIntervalFn(id)
```
