# babel-plugin-optimize-hook-destructuring

Babel plugin for transforming this `const [value, setValue] = useState(null)` to this `const {0: value, 1: setValue} = useState(null);`.

Note that this plugin only convert hooks (function name starting with `use`).

**input:**

```js
function Foo() {
  // this gets converted to object destructuring:
  const [count, setCount] = useState(0);

  // but non-hook calls are not modified:
  const [a, b] = [0, 1];
  const [c, d] = otherThings();
  const f = 0;
}
```

**output:**

```js
function Foo() {
  // this gets converted to object destructuring:
  const { 0: count, 1: setCount } = useState(0);

  // but non-hook calls are not modified:
  const [a, b] = [0, 1];
  const [c, d] = otherThings();
  const f = 0;
}
```
