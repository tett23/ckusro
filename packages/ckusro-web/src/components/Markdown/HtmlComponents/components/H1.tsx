import { HastElement } from '../../Hast';

function H1(ast: HastElement) {}

function H1Text({ children }) {
  <Text>{children}</Text>;
}

function H1Node(ast: HastElement) {
  const children = ast.children.map((node) => {
    if (node.type === 'text') {
      <H1Text>{node.value}</H1Text>;
    }

    const C = components[node.type];
    return <C>{node}</C>;
  });
  return <Block>{children}</Block>;
}
