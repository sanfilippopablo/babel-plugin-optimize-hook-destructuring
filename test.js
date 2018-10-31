const plugin = require("./index");
const pluginTester = require("babel-plugin-tester");

pluginTester({
  plugin,
  babelOptions: {
    generatorOpts: {
      compact: true
    }
  },
  tests: [
    {
      code: "const [a, b, {c}] = something;",
      output: "const {0:a,1:b,2:{c}} = something;"
    }
  ]
});
