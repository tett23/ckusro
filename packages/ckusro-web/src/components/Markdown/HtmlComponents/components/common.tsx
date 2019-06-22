import React from 'react';
import { View } from '../../../shared';
import styled, { css } from '../../../styled';
import { Text } from '../../../FileMenu/TreeView/styles';
import { HastElement, HastElementChild } from '../../Hast';

export type MarkdownTheme = {};

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

export const Div = styled(View)`
  display: block;
`;

export const Span = styled(Text)`
  ${base}
  display: inline;

  color: #24292e;
  font-size: 16px;
  line-height: 1.5em;
  word-wrap: break-word;
`;

export const topLevel = styled(Div)`
  margin-bottom: 16px;
  margin-top: 0;
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
      if (node.value.trim().length === 0) {
        return null;
      }
      if (allowTextNode || allowTextNode == null) {
        return (
          <TextElement key={getKey.next().value} data-tag="text">
            {node.value}
          </TextElement>
        );
      } else {
        return null;
      }
    }

    const C = components[node.tagName] || components.Div;
    return <C key={getKey.next().value} components={components} hast={node} />;
  });

  return <Outer data-tag={hast.tagName}>{children}</Outer>;
}

export function Inline({ components, hast, TextElement }: InlineProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      return (
        <React.Fragment key={getKey.next().value}>{node.value}</React.Fragment>
      );
    }

    const C = components[node.tagName] || components.Span;
    return <C key={getKey.next().value} components={components} hast={node} />;
  });

  return <TextElement data-tag={hast.tagName}>{children}</TextElement>;
}

const getKey = randomKey();

export function* randomKey(): IterableIterator<string> {
  let n = 0;

  while (true) {
    n++;
    yield `${n}`;
  }
}
