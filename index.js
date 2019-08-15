module.exports = babel => {
  const { types: t } = babel;
  const isHook = /^use[A-Z]/;

  return {
    name: "optimize-hook-destructuring",
    visitor: {
      CallExpression(path) {
        if (isHook.test(path.node.callee.name) && t.isArrayPattern(path.parent.id)) {
          path.parent.id = t.objectPattern(
            path.parent.id.elements.map((element, i) =>
              t.objectProperty(t.numericLiteral(i), element)
            )
          );
        }
      }
    }
  };
};
