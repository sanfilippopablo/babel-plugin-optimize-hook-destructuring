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
      code: "const[count,setCount]=useState(0);",
      output: "const{0:count,1:setCount}=useState(0);"
    },
    {
      code: "const[a,b]=[0,1];",
      output: "const[a,b]=[0,1];"
    },
    {
      code: "const[c,d]=otherThings();",
      output: "const[c,d]=otherThings();"
    },
    {
      code: "const f=0;",
      output: "const f=0;"
    }
  ]
});
