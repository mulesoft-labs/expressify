# Expressify

Wrap Express functions to support promises

## Install

As an npm package

```
npm install expressify
```

## Usage

Controller:

```js
const expressify = require('expressify')(callback);
// callback function (optional) will be executed after an expressify function resolves

const controller = expressify({
  foo,
  bar
});

function foo(req, res) {
  return resolvedPromise();
}

function bar(req, res) {
  return rejectedPromise();
}

module.exports = controller;
```

Express configuration:

```js
const { foo, bar } = require('./your_controller');

app.get('/foo', foo);
app.get('/bar', bar);
```

## License

MIT
