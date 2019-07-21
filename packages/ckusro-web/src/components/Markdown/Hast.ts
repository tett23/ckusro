import {
  Literal as UnistLiteral,
  Node as UnistNode,
  Parent as UnistParent,
} from 'unist';

export type HastParent = UnistParent & {
  children: Array<HastDoctype | HastElementChild>;
};

export type HastLiteral = UnistLiteral & {
  value: string;
};

export type HastRoot = HastParent & {
  type: 'root';
  children: HastElementChild[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HastProperties = Record<string, any>;

export type HastElement = UnistParent & {
  type: 'element';
  tagName: string;
  properties?: HastProperties;
  content?: HastRoot;
  children: HastElementChild[];
};

export type HastElementChild = HastElement | HastComment | HastText;

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
