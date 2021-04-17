+++
title = "Quickstart"
date = 2021-04-17T08:51:56-04:00
weight = 1
pre = "<b>✽ </b>"
+++

Goodtimer is installed via [npm](https://npmjs.org/package/goodtimer) for use in NodeJS projects. It is also available for client-side JavaScript via CDN.

{{< tabs >}}
{{% tab name="Node/npm" %}}
Run the install command in your shell

```shell
npm i -S goodtimer
```
{{% /tab %}}
{{% tab name="Browser" %}}
Paste the following into your HTML:
```html
<script src="https://cdn.nickpal.to/goodtimer/goodtimer-3.4.0.js"></script>
```
{{% /tab %}}
{{< /tabs >}}

And use in your code! You generally want to deconstruct one of the exported classes.

{{< tabs >}}
{{% tab name="Node/npm" %}}
Access via `require`

```javascript
const { Timer } = require('goodtimer');

const myFirstTimer = new Timer(
    '1m', 
    (t) => console.log(t.toString()),
    () => console.log('Time\'s up!')
);

```
{{% /tab %}}
{{% tab name="Browser" %}}

```javascript
const { Timer } = window.goodtimer;

const myFirstTimer = new Timer(
    '1m',
    (t) => console.log(t.toString()),
    () => console.log('Time\'s up!')
);
```

{{% /tab %}}
{{< /tabs >}}

Using timeutils.

If you only want utility functions, such as [setGoodInterval](/timeutils/api/#setgoodinterval),
you can access them on `timeutil`.


{{< tabs >}}
{{% tab name="Node/npm" %}}
```javascript
const { setGoodInterval, clearGoodInterval } = require('goodtimer').timeutil;
```
{{% /tab %}}
{{% tab name="Browser" %}}

```javascript
const { setGoodInterval, clearGoodInterval } = window.goodtimer.timeutil;
```

{{% /tab %}}
{{< /tabs >}}
