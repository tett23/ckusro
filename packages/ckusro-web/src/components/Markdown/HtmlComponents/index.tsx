import console = require('console');
import React from 'react';
import { Hast, HastElement, HastText } from '../Hast';
import { flowContentsNames, FlowContentsNames } from './elementTypes';
import { markdownComponents, MarkdownTheme } from './styles';

export type HtmlComponents = { [c in FlowContentsNames]: HtmlComponent } & {
  text: TextComponent;
};

type HtmlComponentProps = HastElement & { key: string };
type HtmlComponent = (props: HtmlComponentProps) => JSX.Element;

type TextComponentProps = { value: string; key: string };
type TextComponent = (props: TextComponentProps) => JSX.Element;

export function HtmlComponents(theme: MarkdownTheme): HtmlComponents {
  const components = markdownComponents(theme);

  const textComponent = {
    text: components.text,
    ...components,
  };

  return flowContentsNames.reduce(
    (acc: HtmlComponents, item: FlowContentsNames) => {
      const c = (components as any)[item];
      acc[item] = c == null ? components.text : c;

      return acc;
    },
    textComponent as HtmlComponents,
  );
}

export function render(hast: Hast, theme: MarkdownTheme): JSX.Element | null {
  const components = HtmlComponents(theme);
  console.log(hast);

  return renderNode(components, components.text, hast, 'root');
}

function renderNode(
  components: HtmlComponents,
  Component: any,
  node: Hast,
  key: string,
): JSX.Element | null {
  switch (node.type) {
    case 'root':
      return <>{map(components, components.text, node.children)}</>;
    case 'element':
      return renderElement(components, node, key);
    case 'doctype':
      return null;
    case 'comment':
      return null;
    case 'text':
      return renderText(components, Component, node, key);
    default:
      throw new Error('');
  }
}

function renderElement(
  components: HtmlComponents,
  node: HastElement,
  key: string,
) {
  const TextComponent = components[node.tagName];
  if (TextComponent == null) {
    console.log(node.tagName);
    return (
      <components.Block key={key}>
        <>{map(components, components.text, node.children)}</>
      </components.Block>
    );
  }

  return (
    <components.Block key={key}>
      <>{map(components, TextComponent, node.children)}</>
    </components.Block>
  );
}

function renderText(
  components: HtmlComponent,
  Component: any,
  node: HastText,
  key: string,
) {
  if (node.value.trim().length === 0) {
    return null;
  }

  return (
    <Component key={key}>
      <components.text>{node.value.trim()}</components.text>
    </Component>
  );
}

function map(components: HtmlComponents, Component: any, nodes: Hast[]) {
  return nodes.map((node, i) => {
    console.log(node);
    return renderNode(components, Component, node, `${i}`);
  });
}
