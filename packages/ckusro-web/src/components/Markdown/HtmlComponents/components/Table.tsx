import React from 'react';
import styled from '../../../styled';
import {
  Block,
  bold,
  Div,
  ElementProps,
  Inline,
  Span,
  topLevel,
} from './common';

const tableCell = styled(Span)`
  display: table-cell;
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
  margin: 0;
`;

const table = styled(topLevel)`
  display: table;
  overflow: auto;
  width: 100%;
`;

const rowGroup = styled(Div)`
  display: table-row-group;
`;

const tr = styled(Div)`
  display: table-row;
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
  padding: 0;

  :nth-child(2n) {
    background-color: #f6f8fa;
  }
`;

const thText = styled(tableCell)`
  ${bold}
`;

export function Table(props: ElementProps) {
  return (
    <Block {...props} Outer={table} TextElement={Span} allowTextNode={false} />
  );
}

export function Thead(props: ElementProps) {
  return (
    <Block
      {...props}
      Outer={rowGroup}
      TextElement={Span}
      allowTextNode={false}
    />
  );
}

export function Tbody(props: ElementProps) {
  return (
    <Block
      {...props}
      Outer={rowGroup}
      TextElement={Span}
      allowTextNode={false}
    />
  );
}

export function Tfoot(props: ElementProps) {
  return (
    <Block
      {...props}
      Outer={rowGroup}
      TextElement={Span}
      allowTextNode={false}
    />
  );
}

export function Tr(props: ElementProps) {
  return (
    <Block {...props} Outer={tr} TextElement={Span} allowTextNode={false} />
  );
}

export function Th(props: ElementProps) {
  return <Inline {...props} TextElement={thText} />;
}

export function Td(props: ElementProps) {
  return <Inline {...props} TextElement={tableCell} />;
}

export function Caption(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={Span} />;
}

export function Col(props: ElementProps) {
  return <Inline {...props} TextElement={tableCell} />;
}

export function ColGroup(props: ElementProps) {
  return <Block {...props} Outer={Div} TextElement={Span} />;
}
