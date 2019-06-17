import { MarkdownTheme } from '../styles';
import Div from './Div';
import { Heading } from './Heading';
import Span from './Span';

export default function components(_: MarkdownTheme) {
  return {
    Span,
    Div,
    h1: Heading,
    h2: Heading,
    h3: Heading,
    h4: Heading,
    h5: Heading,
    h6: Heading,
  };
}
