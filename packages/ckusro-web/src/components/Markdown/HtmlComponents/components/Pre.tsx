import React from 'react';
import styled from '../../../styled';
import { HastElementChild } from '../../Hast';
import { ElementProps, Inline, randomKey, Span, topLevel } from './common';

const pre = styled(topLevel)`
  background-color: #f6f8fa;
  border-radius: 3px;
  overflow: auto;
  padding: 16px;
`;

const preText = styled(Span)`
  font-size: 85%;
  line-height: 1.45em;
  background-color: transparent;
  background: transparent;
`;

const preCode = styled(Span)`
  font-size: 85%;
  line-height: 1.45em;
  font-family: monospace;
  background-color: transparent;
  background: transparent;
  white-space: pre;
`;

export default function Pre({ components, hast }: ElementProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      const PreText = preText;
      return <PreText key={getKey.next().value}>{node.value}</PreText>;
    }

    if (node.tagName === 'code') {
      return (
        <Inline
          key={getKey.next().value}
          components={components}
          hast={node}
          TextElement={preCode}
        />
      );
    }

    const C = components[node.tagName] || components.Div;
    return <C key={getKey.next().value} components={components} hast={node} />;
  });

  const Pre = pre;

  return <Pre key={getKey.next().value}>{children}</Pre>;
}

const getKey = randomKey();
