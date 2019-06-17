import React from 'react';
import styled, { css } from '../../../styled';
import { Block, Div, ElementProps, Inline, Span } from './common';

const listPadding = css`
  padding-left: 2em;
`;

const ul = styled(Div)`
  ${listPadding}
`;

const li = styled(Div)`
  display: list-item;
`;

export function Ul(props: ElementProps) {
  return <Block {...props} Outer={ul} TextElement={Span} />;
}

export function Li(props: ElementProps) {
  return <Inline {...props} Outer={li} TextElement={Span} />;
}
