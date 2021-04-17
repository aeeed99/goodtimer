+++
title = "The Time Class"
date = 2021-04-17T11:27:51-04:00
weight = 5
pre = "<b>✽ </b>"
+++

{{% notice info %}}
`Time` is primarily intended to be used by the `Timer` class, rather than in isolation. As such, it is
not as fully functional as it should be. For example, negative values are not supported. `Time` is still accessible,
however, as it can be used for basic time comparisons.
{{% /notice %}}

## Getting Started with `Time`

`Time` is `Timer` without the countdown or callback functionality. Technically, it is the base-class for `Timer`.

### Creating a `Time` object

`Time` can be imported from `goodtimer`. Its constructor only takes a timeExpression. i.e. `new Time(timeExpression)`

```javascript
const { Time } = require('goodtimer');

const minute = new Time('1m');
const hour = new Time('1h');

minute.toString(); // -> "01:00.000"
hour.toString();   // -> "01:00:00.000"  
```

#### Other `Time` methods.

Below is a demonstration of all `Time` methods. Remember, all of these methods are also available with `Timer`.

```javascript
const minute = new Time('1m');
const hour = new Time('1h');

minute.inMilliseconds(); // -> 60000
minute.toString()        // -> "01:00.000"

minute.gt(hour);         // -> false
minute.gte(hour);        // -> false
minute.lt(hour);         // -> true
minute.lte(hour);        // -> true
minute.equals(hour);     // -> false

minute.set(hour);        // set to new time
minute.equals(hour);     // -> true
```


