type Flat<T> = T extends Array<infer U> ? U : T;

declare interface Array<T> {
  flat(): Flat<T>;
  flat<U>(): Flat<U>;
  flatMap(func: (x: T, i?: number) => T | T[] | []): T[];
  flatMap<U>(func: (x: T, i?: number) => U | U[] | []): U[];
}

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

declare module 'unionfs';

declare module 'remark-breaks';
declare module 'remark-parse';
declare module 'remark-rehype';
declare module 'rehype-parse';
