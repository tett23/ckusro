import React from 'react';
import { ElementProps, Inline, Span as SpanBase } from './common';

export default function Span(props: ElementProps) {
  return <Inline {...props} TextElement={SpanBase} />;
}
