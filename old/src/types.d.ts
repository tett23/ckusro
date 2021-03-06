declare module 'remark-parse';
declare module 'remark-stringify';
declare module 'remark-breaks';
declare module 'remark-rehype';
declare module 'rehype-parse';
declare module 'rehype-react';
declare module '@mdx-js/mdx' {
  export type Config = {
    mdPlugins: any[];
    footnotes?: boolean;
    hastPlugins?: any[];
    compilers?: any[];
    blocks?: RegExp[];
  };

  export interface Compiler {
    parse: (text: string) => any;
  }

  export function createMdxAstCompiler(config: Config): Compiler;
  export function sync(template: string, config: Config): string;
}

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare interface Array<T> {
  flat(): T[];
  flatMap(func: (x: T, i?: number) => T | T[] | []): T[];
  flatMap<U>(func: (x: T, i?: number) => U | U[] | []): U[];
}
