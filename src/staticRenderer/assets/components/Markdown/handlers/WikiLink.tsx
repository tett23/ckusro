import fromDOM from 'hast-util-from-dom';
import merge from 'lodash.merge';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export type Options = {
  components: any;
};

const defaultOptions: Options = {
  components: {},
};

type JSXNode = {
  type: 'jsx';
  value: string;
  data: {
    component: string;
    props: { [key in string]: any } | null;
  };
};

export default function transform(
  options: DeepPartial<Options>,
  node: JSXNode,
) {
  const merged: Options = merge(defaultOptions, options);

  const { component, props } = (node as JSXNode).data;
  const Component = merged.components[component];
  if (Component == null) {
    return node;
  }

  const str = ReactDOMServer.renderToString(<Component {...props || {}} />);
  const dom = new DOMParser().parseFromString(str, 'text/html');
  const hast = fromDOM(dom).children[0].children[1].children[0];

  return hast;
}
