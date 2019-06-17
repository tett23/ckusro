import React from 'react';
import styled, { css } from '../../../styled';
import { HastElementChild } from '../../Hast';
import { bold, Div, ElementProps, Span } from './common';

const headingMargin = css`
  margin-top: 0;
  margin-bottom: 0;
`;

const heading = styled(Span)`
  ${bold}
  ${headingMargin}
`;

const H1Text = styled(heading)`
  font-size: 2em;
`;
const H2Text = styled(heading)`
  font-size: 1.5em;
`;
const H3Text = styled(heading)`
  font-size: 1.25em;
`;
const H4Text = styled(heading)`
  font-size: 1.25em;
`;
const H5Text = styled(heading)`
  font-size: 1em;
`;
const H6Text = styled(heading)`
  font-size: 1em;
`;

export function Heading({ components, hast }: ElementProps) {
  const children = hast.children.map((node: HastElementChild) => {
    if (node.type === 'comment') {
      return null;
    }
    if (node.type === 'text') {
      switch (hast.tagName) {
        case 'h1':
          return <H1Text>{node.value}</H1Text>;
        case 'h2':
          return <H2Text>{node.value}</H2Text>;
        case 'h3':
          return <H3Text>{node.value}</H3Text>;
        case 'h4':
          return <H4Text>{node.value}</H4Text>;
        case 'h5':
          return <H5Text>{node.value}</H5Text>;
        case 'h6':
          return <H6Text>{node.value}</H6Text>;
        default:
          return <Span>{node.value}</Span>;
      }
    }

    const C = components[node.tagName] || components.Span;
    return <C components={components} hast={node} />;
  });

  return <Div>{children}</Div>;
}
