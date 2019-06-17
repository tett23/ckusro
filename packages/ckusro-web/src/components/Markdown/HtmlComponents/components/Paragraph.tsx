import React from 'react';
import styled from '../../../styled';
import { Block, ElementProps, Span, topLevel } from './common';

const paragraph = styled(topLevel)`
  margin-top: 0;
`;

export function Paragraph(props: ElementProps) {
  return <Block {...props} Outer={paragraph} TextElement={Span} />;
}
