---
title: "TimeExpressions"
date: 2021-04-17T10:53:08-04:00
weight: 3
---

TimeExpressions are various formats of time that goodtimer recognizes. They are passed in many places, such as the
constructors for creating Timers and Time, as well as any place where time is being compared or set.

#### UTC-like `string`

There are two ways represent a TimeExpression as a string. The first is UTC-like. Colons and the dot are all
optional.
```
00:00:00:00:00.000 <- milliseconds
|  |  |  |  |
|  |  |  |  seconds
|  |  |  minutes
|  |  hours
|  days
years
```

Units of time are interpreted from right to left. `'3:00'` is three minutes, `'3:00:00'` is three hours `'3:00:00:00:00'` is
three years. A number as a string (`'3'`) is the number of seconds, and an empty string is 0.

Milliseconds must be explicitly specified with the dot, and missing numbers places get a `0` appended. `.01` is
`10` milliseconds (`.010`), and `.1` is `100 millseconds` (`.100`). This makes values like `:02.5` behaive the way you'd
expect: `2.500` seconds or "two and a half seconds".

#### unit-notation `string`.

You can specify each unit of time in a string with their abbreviation, listed below:

* **`ms`** - milliseconds
* **`s`** - seconds
* **`m`** - minutes
* **`h`** - hours
* **`d`** - days
* **`y`** - years

All units are optional. While doing so would be questionable, notations can be out of order. `1d` is 1 day
(`01:00:00:00.000`), `1h30m` or `30m1h` is 1 hour 30 minutes, while `1h30ms` (note the s) is 1 hour 30 _milliseconds_

#### milliseconds `number`

Passing a number represents time in milliseconds. `350` produces the same time as thees `'350ms'` and `'.35'` string
counterparts.

Note `350` and `'350'` are NOT the same. The number is 350 milliseconds while the string would be 350 _seconds_.

