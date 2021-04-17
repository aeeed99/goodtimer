---
title: "setGoodInterval"
date: 2021-04-17T09:07:35-04:00
---

### setGoodInterval

A smart replacement for `setInterval`

#### Usage

```typescript
setGoodInterval(callback: Function, timeout: number): number
```

#### Params

* **callback** - A function that is invoked at each interval.
* **timeout** - Time (in milliseconds) to wait before calling the callback each time.

#### Returns

**goodIntervalId** - An id of the interval that can be used to clear via [clearGoodInterval](#clearGoodInterval)
