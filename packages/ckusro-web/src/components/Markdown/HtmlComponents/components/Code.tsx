import React from 'react';
import styled from '../../../styled';
import { ElementProps, Inline, Span } from './common';

const codeText = styled(Span)`
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
`;

export default function Code(props: ElementProps) {
  return <Inline {...props} TextElement={codeText} />;
}
