import React from 'react';
import styled, { css } from '../../../styled';
import { Block, bold, Div, ElementProps, Span } from './common';

const headingMargin = css`
  margin-top: 0;
  margin-bottom: 0;
`;

const heading = styled(Span)`
  ${bold}
  ${headingMargin}
`;

const h1Text = styled(heading)`
  font-size: 2em;
`;
const h2Text = styled(heading)`
  font-size: 1.5em;
`;
const h3Text = styled(heading)`
  font-size: 1.25em;
`;
const h4Text = styled(heading)`
  font-size: 1.25em;
`;
const h5Text = styled(heading)`
  font-size: 1em;
`;
const h6Text = styled(heading)`
  font-size: 1em;
`;

export function H1(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h1Text} />;
}

export function H2(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h2Text} />;
}

export function H3(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h3Text} />;
}

export function H4(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h4Text} />;
}

export function H5(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h5Text} />;
}

export function H6(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={h6Text} />;
}
