import React from 'react';
import styled from '../../../styled';
import { Block, Div, ElementProps, Span } from './common';

const p = styled(Div)`
  margin-top: 0;
`;

export function Paragraph(props: ElementProps) {
  return <Block {...props} Outer={p} TextElement={Span} />;
}
