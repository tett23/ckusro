import React from 'react';
import styled from '../../../styled';
import { HastElementChild } from '../../Hast';
import { ElementProps, Inline, Span, topLevel } from './common';

const pre = styled(topLevel)`
  background-color: #f6f8fa;
  border-radius: 3px;
  font-size: 85%;
  line-height: 1.45;
  overflow: auto;
  padding: 16px;
  white-space: pre;
`;

const preText = styled(Span)`
  background-color: transparent;
  background: transparent;
`;

const preCode = styled(Span)`
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
      return <PreText>{node.value}</PreText>;
    }

    if (node.tagName === 'code') {
      return (
        <Inline components={components} hast={node} TextElement={preCode} />
      );
    }

    const C = components[node.tagName] || components.Div;
    return <C components={components} hast={node} />;
  });

  const Pre = pre;

  return <Pre>{children}</Pre>;
}
