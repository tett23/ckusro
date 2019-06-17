import React from 'react';
import styled, { css } from '../../../styled';
import { HastElement, HastElementChild } from '../../Hast';

export type ElementProps = {
  components: any;
  hast: HastElement;
};

const base = css`
  white-space: normal;
`;

export const bold = css`
  font-weight: 600;
`;

export const Div = styled.View`
  ${base}
  display: block;
`;

export const Span = styled.Text`
  ${base}
  display: inline;

  color: #24292e;
  font-size: 1em;
  line-height: 1.5em;
  word-wrap: break-word;
  margin: 0.67em 0;
`;

export type BlockProps = ElementProps & {
  TextElement: any;
  Outer: any;
  allowTextNode?: boolean;
};

export type InlineProps = ElementProps & {
  TextElement: any;
};

export function Block({
  components,
  hast,
  TextElement,
  Outer,
  allowTextNode,
}: BlockProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      if (allowTextNode || allowTextNode == undefined) {
        return <TextElement>{node.value}</TextElement>;
      } else {
        return null;
      }
    }

    const C = components[node.tagName] || components.Div;
    return <C components={components} hast={node} />;
  });

  return <Outer>{children}</Outer>;
}

export function Inline({ components, hast, TextElement }: InlineProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      return <>{node.value}</>;
    }

    const C = components[node.tagName] || components.Span;
    return <C components={components} hast={node} />;
  });

  return <TextElement>{children}</TextElement>;
}
