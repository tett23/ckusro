/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '@isomorphic-git/lightning-fs';

interface FSAction<T = string, Payload = any> {
  type: T;
  payload: Payload;
  error?: boolean;
  meta?: Record<string, any>;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

type ValuesOf<T> = T extends Record<any, infer U> ? U : never;
