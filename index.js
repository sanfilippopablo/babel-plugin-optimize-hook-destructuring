module.exports = babel => {
  const { types: t } = babel;

  return {
    name: "class-to-function", // not required
    visitor: {
      VariableDeclarator(path) {
        if (t.isArrayPattern(path.node.id)) {
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
