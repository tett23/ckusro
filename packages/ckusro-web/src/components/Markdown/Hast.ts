import {
  Literal as UnistLiteral,
  Node as UnistNode,
  Parent as UnistParent,
} from 'unist';
import { FlowContentsNames } from './HtmlComponents/elementTypes';

export type HastParent = UnistParent & {
  children: [HastElement | HastDoctype | HastComment | HastText];
};

export type HastLiteral = UnistLiteral & {
  value: string;
};

export type HastRoot = HastParent & {
  type: 'root';
};

export type HastProperties = {};

export type HastElement = UnistParent & {
  type: 'element';
  tagName: FlowContentsNames;
  properties?: HastProperties;
  content?: HastRoot;
  children: HastElementChildren;
};

export type HastElementChildren = Array<HastElement | HastComment | HastText>;

export type HastDoctype = UnistNode & {
  type: 'doctype';
  name: string;
  public?: string;
  system?: string;
};

export type HastComment = HastLiteral & {
  type: 'comment';
};

export type HastText = HastLiteral & {
  type: 'text';
};

export type Hast =
  | HastRoot
  | HastElement
  | HastDoctype
  | HastComment
  | HastText;
