import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App, { Props } from './assets/components';

export default function render(props: Props): string {
  return ReactDOMServer.renderToString(<App {...props} />);
}
