import React from 'react';
import { HastElementChild } from '../../Hast';
import { Div as DivBase, ElementProps, Span } from './common';

export default function Div({ components, hast }: ElementProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      return <DivText>{node.value}</DivText>;
    }

    const C = components[node.tagName] || components.Div;
    return <C components={components} hast={node} />;
  });

  return <DivBase>{children}</DivBase>;
}

function DivText({ children }: { children: string | null }) {
  return <Span>{children}</Span>;
}
