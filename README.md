# babel-plugin-numeric-keys-array-destructure

Babel plugin for transforming this `const [a, b, {c}] = something` to this `const {0: a, 1: b, 2: {c}} = something`.
