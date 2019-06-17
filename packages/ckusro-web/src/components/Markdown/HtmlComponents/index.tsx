import React from 'react';
import { Hast, HastElement } from '../Hast';
import components from './components';
import { MarkdownTheme } from './components/common';

export function render(hast: Hast, theme: MarkdownTheme): JSX.Element | null {
  const cs = components(theme);

  return <cs.Div components={cs} hast={hast as HastElement} />;
}
