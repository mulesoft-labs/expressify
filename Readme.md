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
var expressify = require('expressify');

var controller = expressify({
  foo: foo,
  bar: bar
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
var controller = require('./your_controller');

app.get('/foo', controller.foo);
app.get('/bar', controller.bar);
```

## License

MIT
