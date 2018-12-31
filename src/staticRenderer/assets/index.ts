import React from 'react';
import ReactDOM from 'react-dom';
import App, { Props } from './components';

export default function init(props: Props) {
  ReactDOM.render(
    React.createElement(App, props),
    document.querySelector('#id'),
  );
}
