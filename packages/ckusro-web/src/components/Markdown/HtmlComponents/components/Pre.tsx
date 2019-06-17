import React from 'react';
import styled from '../../../styled';
import { HastElementChild } from '../../Hast';
import { Div, ElementProps, Inline, Span } from './common';

const pre = styled(Div)`
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

const preCode = styled(Div)`
  background: transparent;
  border: 0;
  font-size: 100%;
  margin: 0;
  padding: 0;
  white-space: pre;
  word-break: normal;
`;

const preCodeText = styled(Span)`
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
        <Inline
          components={components}
          hast={node}
          Outer={preCode}
          TextElement={preCodeText}
        />
      );
    }

    const C = components[node.tagName] || components.Div;
    return <C components={components} hast={node} />;
  });

  const Pre = pre;

  return <Pre>{children}</Pre>;
}
