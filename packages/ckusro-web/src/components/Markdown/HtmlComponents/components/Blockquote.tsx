import React from 'react';
import styled from '../../../styled';
import { Block, Div, ElementProps, Span } from './common';

const blockquote = styled(Div)`
  border-left-color: #dfe2e5;
  border-left-style: solid;
  border-left-width: 0.25em;
  padding: 0 1em;

  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }
`;

export default function Blockquote(props: ElementProps) {
  return <Block {...props} Outer={blockquote} TextElement={Span} />;
}
