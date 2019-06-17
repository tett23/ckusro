import { MarkdownTheme } from '../styles';
import Blockquote from './Blockquote';
import Code from './Code';
import Div from './Div';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Li, Ul } from './List';
import { Paragraph } from './Paragraph';
import Pre from './Pre';
import Span from './Span';
import {
  Caption,
  Col,
  ColGroup,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from './Table';

export default function components(_: MarkdownTheme) {
  return {
    Span,
    Div,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    ul: Ul,
    li: Li,
    p: Paragraph,
    blockquote: Blockquote,
    code: Code,
    pre: Pre,
    caption: Caption,
    col: Col,
    colgroup: ColGroup,
    table: Table,
    tbody: Tbody,
    td: Td,
    tfoot: Tfoot,
    th: Th,
    thead: Thead,
    tr: Tr,
  };
}
