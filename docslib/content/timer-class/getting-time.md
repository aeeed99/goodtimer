---
title: "Ways to Get Time"
date: 2021-04-17T11:05:43-04:00
weight: 5
---

`Timer`/`Time` has properties `years`, `days`, `hours`, `minutes`, `seconds`, `milliseconds` to get a specific unit of time. These
are always numbers.

```javascript
const time = new Time('3:35:08.035');

time.milliseconds; // 35
time.seconds; // 8
time.minutes; // 35
time.hours; // 3
time.days; // 0
```

You can also convert full times to milliseconds with `.inMilliseconds()`.

```javascript
const time = new Time('3:35:08.035');

time.inMilliseconds(); // -> 12908035
```

### UI friendly methods

Two handy methods exist to get the time in a human-friendly format: `.toString()` and `.fmtTime()`

#### `.toString()`

By default, this returns the current time in UTC-like syntax (`YY:DD:HH:MM:SS.mmm`). The highest non-zero
unit of time is displayed, and higher ones are left off.

You can also specify the smallest unit to display in the first argument. For example, passing `'s'` (for seconds)
leaves off the smaller millisecond unit of time.

```typescript
const time = new Time('3:33.444');
time.toString(); // => '3:33.444';
time.toString('s'); // '3:33'
```

#### `fmtTime()`

A function designed to provide granular modification of the string, this takes a string with template characters
and replaces them with time values of various formats.

Template characters are prefixed with `%`. Available template characters are:

| character | description | 
| :- | :------------ |
| `%Y` | replaced with the timer's current years
| `%D` | replaced with the timer's current days |
| `%H` | replaced with the timer's current hours |
| `%M` | replaced with the timer's current minutes |
| `%S` | replaced with the timer's current seconds |
| `%m` | replaced with the timer's current milliseconds |
| `%<n>%<y>` | Pads the following template character with `n` zero's, if the value's character length is less than `n`. i.e. `'%2%s'` on a timer with 4 seconds returns `'04'`. the same value on a timer with 15 seconds returns `'15'`