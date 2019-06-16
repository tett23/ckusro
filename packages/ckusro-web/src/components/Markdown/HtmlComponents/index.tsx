import React from 'react';
import { Hast, HastElement, HastText } from '../Hast';
import { flowContentsNames, FlowContentsNames } from './elementTypes';
import { Text, View } from './styles';

export type HtmlComponents = { [c in FlowContentsNames]: HtmlComponent } & {
  text: TextComponent;
};

type HtmlComponentProps = HastElement & { key: string };
type HtmlComponent = (props: HtmlComponentProps) => JSX.Element;

type TextComponentProps = { value: string; key: string };
type TextComponent = (props: TextComponentProps) => JSX.Element;

export function HtmlComponents(): HtmlComponents {
  const defaultComponent = ({ children, key }: HtmlComponentProps) => (
    <View key={key}>{map(components as any, children)}</View>
  );
  const components = {
    text: ({ value, key }: TextComponentProps) => (
      <Text key={key}>{value}</Text>
    ),
  };

  return flowContentsNames.reduce(
    (acc: HtmlComponents, item: FlowContentsNames) => {
      acc[item] = defaultComponent;

      return acc;
    },
    components as HtmlComponents,
  );
}

export function render(hast: Hast): JSX.Element | null {
  const components = HtmlComponents();

  return renderNode(components, hast, 'root');
}

function renderNode(
  components: HtmlComponents,
  node: Hast,
  key: string,
): JSX.Element | null {
  switch (node.type) {
    case 'root':
      return <>{map(components, node.children)}</>;
    case 'element':
      return renderElement(components, node, key);
    case 'doctype':
      return null;
    case 'comment':
      return null;
    case 'text':
      return renderText(components, node, key);
    default:
      throw new Error('');
  }
}

function renderElement(
  components: HtmlComponents,
  node: HastElement,
  key: string,
) {
  const component = components[node.tagName];
  if (component == null) {
    throw new Error('');
  }

  return component({ ...node, key });
}

function renderText(components: HtmlComponents, node: HastText, key: string) {
  return components.text({ value: node.value, key });
}

function map(components: HtmlComponents, nodes: Hast[]) {
  return nodes.map((node, i) => {
    return renderNode(components, node, `${i}`);
  });
}
