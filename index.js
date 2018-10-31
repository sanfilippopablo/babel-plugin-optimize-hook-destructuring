module.exports = babel => {
  const { types: t } = babel;

  return {
    name: "optimize-hook-destructuring",
    visitor: {
      VariableDeclarator(path) {
        if (t.isArrayPattern(path.node.id) && t.isCallExpression(path.node.init) && path.node.init.callee.name.match(/^use[A-Z]/)) {
          path.node.id = t.objectPattern(
            path.node.id.elements.map((element, i) =>
              t.objectProperty(t.numericLiteral(i), element)
            )
          );
        }
      }
    }
  };
};
