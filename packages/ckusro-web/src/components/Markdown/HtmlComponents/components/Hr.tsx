import React from 'react';
import styled from '../../../styled';
import { Block, Div, ElementProps, Span } from './common';

const hr = styled(Div)`
  box-sizing: content-box;
  background: transparent;
  border: 0;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #dfe2e5;
  overflow: hidden;
  background-color: #e1e4e8;
  height: 0.25em;
  margin: 24px 0;
  padding: 0;
`;

export function Hr(props: ElementProps) {
  return <Block {...props} Outer={hr} TextElement={Span} />;
}
