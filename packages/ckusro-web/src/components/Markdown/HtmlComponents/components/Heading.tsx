import React from 'react';
import styled, { css } from '../../../styled';
import { Block, bold, Div, ElementProps, Span } from './common';

const headingMargin = css`
  margin-top: 0;
  margin-bottom: 0;
`;

const heading = styled(Div)`
  ${headingMargin}

  margin-bottom: 16px;
  margin-top: 24px;
`;
const headingText = styled(Span)`
  ${bold}
  ${headingMargin}

  line-height: 1.25em;
  margin-bottom: 16px;
  margin-top: 24px;
`;

const h1 = styled(heading)`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #eaecef;

  margin: 0.67em 0;
  padding-bottom: 0.3em;

  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
`;
const h1Text = styled(headingText)`
  font-size: 2em;
`;

const h2 = styled(heading)`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #eaecef;

  margin-block-start: 0.83em;
  margin-block-end: 0.83em;

  margin-bottom: 16px;
  margin-top: 24px;

  padding-bottom: 0.3em;
`;
const h2Text = styled(headingText)`
  font-size: 1.5em;
`;

const h3 = styled(heading)``;
const h3Text = styled(headingText)`
  font-size: 1.25em;
`;

const h4 = styled(heading)``;
const h4Text = styled(headingText)`
  font-size: 1.25em;
`;

const h5 = styled(heading)``;
const h5Text = styled(headingText)`
  font-size: 1em;
`;

const h6 = styled(heading)``;
const h6Text = styled(headingText)`
  font-size: 1em;
  color: #6a737d;
`;

export function H1(props: ElementProps) {
  return <Block {...props} Outer={h1} TextElement={h1Text} />;
}

export function H2(props: ElementProps) {
  return <Block {...props} Outer={h2} TextElement={h2Text} />;
}

export function H3(props: ElementProps) {
  return <Block {...props} Outer={h3} TextElement={h3Text} />;
}

export function H4(props: ElementProps) {
  return <Block {...props} Outer={h4} TextElement={h4Text} />;
}

export function H5(props: ElementProps) {
  return <Block {...props} Outer={h5} TextElement={h5Text} />;
}

export function H6(props: ElementProps) {
  return <Block {...props} Outer={h6} TextElement={h6Text} />;
}
