import React from 'react';
import { HastElementChild } from '../../Hast';
import { ElementProps, Span as SpanBase } from './common';

export default function Span({ components, hast }: ElementProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      return <SpanText>{node.value}</SpanText>;
    }

    const C = components[node.tagName] || components.Span;
    return <C components={components} hast={node} />;
  });

  return <SpanBase>{children}</SpanBase>;
}

function SpanText({ children }: { children: string | null }) {
  return <SpanBase>{children}</SpanBase>;
}
