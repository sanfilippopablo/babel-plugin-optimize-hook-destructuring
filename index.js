// matches any hook-like (the default)
const isHook = /^use[A-Z]/;

// matches only built-in hooks provided by React et al
const isBuiltInHook = /^use(Callback|Context|DebugValue|Effect|ImperativeHandle|LayoutEffect|Memo|Reducer|Ref|State)$/;

module.exports = (babel, options) => {

  const { types: t } = babel;
  const onlyBuiltIns = options && options.onlyBuiltIns;

  // if specified, options.lib is a list of libraries that provide hook functions
  const libs = options && options.lib && (
    options.lib === true ? ['react', 'preact/hooks'] : [].concat(options.lib)
  );

  return {
    name: "optimize-hook-destructuring",
    visitor: {
      CallExpression(path) {
        // skip function calls where the return value is not Array-destructured:
        if (!t.isArrayPattern(path.parent.id)) return;

        // name of the (hook) function being called:
        const hookName = path.node.callee.name;

        if (libs) {
          const binding = path.scope.getBinding(hookName);
          // not an import
          if (!binding || binding.kind !== 'module') return;

          const specifier = binding.path.parent.source.value;
          // not a match
          if (!libs.some(lib => lib === specifier)) return;
        }
        
        // only match function calls with names that look like a hook
        if (!(onlyBuiltIns ? isBuiltInHook : isHook).test(hookName)) return;
        
        path.parent.id = t.objectPattern(
          path.parent.id.elements.map((element, i) =>
            t.objectProperty(t.numericLiteral(i), element)
          )
        );
      }
    }
  };
};
