+++
title = "timeutil"
date = 2021-03-17T09:03:11-04:00
weight = 5
pre = "<b>✽ </b>"
+++

### timeutil

The `timeutil` exports provide convenient functions for dealing with time outside of 
`goodtimer.Timer`. These are imported like so:

```javascript
const { timeutil } = require('goodtimer');
```

Or require in a specific function

```javascript
const { setGoodInterval } = require('goodtimer').timeutil;
```

---

#### Available functions:

{{% children %}}
