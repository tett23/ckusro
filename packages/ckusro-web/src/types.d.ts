declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '@isomorphic-git/lightning-fs';

type FSAction<Payload = any> = {
  type: string;
  payload: Payload;
  error?: boolean;
  meta?: Object;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};
