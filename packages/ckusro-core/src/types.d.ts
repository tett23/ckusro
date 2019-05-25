declare interface Array<T> {
  flat(): T[];
  flatMap(func: (x: T, i?: number) => T | T[] | []): T[];
  flatMap<U>(func: (x: T, i?: number) => U | U[] | []): U[];
}
