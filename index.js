// matches any hook-like (the default)
const isHook = /^use[A-Z]/;

// matches only built-in hooks provided by React et al
const isBuiltInHook = /^use(?:Callback|Context|DebugValue|Effect|ImperativeHandle|LayoutEffect|Memo|Reducer|Ref|State)$/;

/**
 * @typedef Options
 * @property {boolean|string} [lib=false] If specified, only hook functions imported from this module are processed. Pass `true` to include 'react' and 'preact/hooks'.
 * @property {boolean} [onlyBuiltIns=false] Only optimize known built-in hooks from react/preact.
 */

/**
 * @param {import('@babel/core')} api
 * @param {Options} [options]
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = ({ types: t }, /** @type {Options} */ options = {}) => {
  const libs = options.lib && (options.lib === true ? ['react', 'preact/hooks'] : [options.lib]);
  const onlyBuiltIns = options.onlyBuiltIns || false;

  /** @type {import('@babel/core').Visitor} */
  const visitor = {
    CallExpression(path) {
      // skip function calls that are not the init of a variable declaration:
      if (!t.isVariableDeclarator(path.parent)) return;

      // skip function calls where the return value is not Array-destructured:
      if (!t.isArrayPattern(path.parent.id)) return;

      // name of the (hook) function being called:
      if (!t.isIdentifier(path.node.callee)) return;
      const hookName = path.node.callee.name;

      if (libs) {
        const binding = path.scope.getBinding(hookName);

        // not an import
        if (!binding || binding.kind !== 'module' || !t.isImportDeclaration(binding.path.parent)) return;
        
        const specifier = binding.path.parent.source.value;
        // not a match
        if (!libs.includes(specifier)) return;
      }

      // only match function calls with names that look like a hook
      if (!(onlyBuiltIns ? isBuiltInHook : isHook).test(hookName)) return;

      path.parent.id = t.objectPattern(
        path.parent.id.elements.reduce((acc, element, i) => {
          if (element) {
            acc.push(t.objectProperty(t.numericLiteral(i), t.clone(element)));
          }
          return acc;
        }, [])
      );
    }
  };

  return {
    name: 'optimize-hook-destructuring',
    visitor: {
      // this is a workaround to run before preset-env destroys destructured assignments
      Program(path) {
        path.traverse(visitor);
      }
    }
  };
};
