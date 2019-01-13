import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import App, { Props } from './assets/components';

export type RenderResult = {
  html: string;
  styles: string;
};

export default function render(props: Props): RenderResult {
  const sheet = new ServerStyleSheet();
  const html = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <App {...props} />
    </StyleSheetManager>,
  );
  const styles = sheet.getStyleTags();

  return {
    html,
    styles,
  };
}
