export interface Stats {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;
}

export interface Dirent {
  name: string;
  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;
}

export type FSCallback<T> = (err: Error, ret: T) => void;
export type PathLike = string | Buffer | URL;

export interface FS {
  lstat(path: PathLike, callback: FSCallback<Stats>): void;

  readdir(
    path: PathLike,
    options:
      | { encoding: BufferEncoding | null; withFileTypes?: false }
      | BufferEncoding
      | undefined
      | null,
    callback: (err: NodeJS.ErrnoException, files: string[]) => void,
  ): void;
  readdir(
    path: PathLike,
    options: { encoding: 'buffer'; withFileTypes?: false } | 'buffer',
    callback: (err: NodeJS.ErrnoException, files: Buffer[]) => void,
  ): void;
  readdir(
    path: PathLike,
    options:
      | { encoding?: string | null; withFileTypes?: false }
      | string
      | undefined
      | null,
    callback: (err: NodeJS.ErrnoException, files: string[] | Buffer[]) => void,
  ): void;
  readdir(
    path: PathLike,
    callback: (err: NodeJS.ErrnoException, files: string[]) => void,
  ): void;
  readdir(
    path: PathLike,
    options: { withFileTypes: true },
    callback: (err: NodeJS.ErrnoException, files: Dirent[]) => void,
  ): void;
}

export interface PromisifiedFS {
  lstat: Promisify<FS['lstat']>;

  readdir(path: PathLike): Promise<string[] | Error>;
  readdir(
    path: PathLike,
    options: {
      encoding?: string;
      withFiletypes?: boolean;
    },
    callback: FSCallback<string>,
  ): Promise<string[] | Error>;
  readdir(
    path: PathLike,
    options: {
      encoding?: string;
      withFiletypes: true;
    },
  ): Promise<Dirent[] | Error>;
}

export type Promisify<F extends AnyFunction> = ArrayToFunction<
  OmitLastArgument<F>,
  Promise<CallbackReturnType<F>>
>;

type AnyFunction = (...args: any[]) => any;

type OmitLastArgument<F extends AnyFunction> = OmitLast<Parameters<F>>;

type CallbackReturnType<F extends AnyFunction> = LastArgument<F> extends (
  ...args: infer Args
) => any
  ? ConvertOr<Args>
  : never;

type LastArgument<F extends AnyFunction> = Last<Parameters<F>>;

type ArrayToFunction<Args, R> =
  | ArrayToFunction0<Args, R>
  | ArrayToFunction1<Args, R>
  | ArrayToFunction2<Args, R>
  | ArrayToFunction3<Args, R>
  | ArrayToFunction4<Args, R>
  | ArrayToFunction5<Args, R>;
type ArrayToFunction0<Args, R> = Args extends [] ? () => R : never;
type ArrayToFunction1<Args, R> = Args extends [infer A]
  ? (arg1: A) => R
  : never;
type ArrayToFunction2<Args, R> = Args extends [infer A, infer B]
  ? (arg1: A, arg2: B) => R
  : never;
type ArrayToFunction3<Args, R> = Args extends [infer A, infer B, infer C]
  ? (arg1: A, arg2: B, arg3: C) => R
  : never;
type ArrayToFunction4<Args, R> = Args extends [
  infer A,
  infer B,
  infer C,
  infer D
]
  ? (arg1: A, arg2: B, arg3: C, arg4: D) => R
  : never;
type ArrayToFunction5<Args, R> = Args extends [
  infer A,
  infer B,
  infer C,
  infer D,
  infer E
]
  ? (arg1: A, arg2: B, arg3: C, arg4: D, arg5: E) => R
  : never;

type OmitLast<T extends any[]> =
  | OmitLast0<T>
  | OmitLast1<T>
  | OmitLast2<T>
  | OmitLast3<T>
  | OmitLast4<T>
  | OmitLast5<T>;
type OmitLast0<T extends any[]> = T extends [] ? never : never;
type OmitLast1<T extends any[]> = T extends [infer _] ? never : never;
type OmitLast2<T extends any[]> = T extends [infer A, infer _] ? [A] : never;
type OmitLast3<T extends any[]> = T extends [infer A, infer B, infer _]
  ? [A, B]
  : never;
type OmitLast4<T extends any[]> = T extends [infer A, infer B, infer C, infer _]
  ? [A, B, C]
  : never;
type OmitLast5<T extends any[]> = T extends [
  infer A,
  infer B,
  infer C,
  infer D,
  infer _
]
  ? [A, B, C, D]
  : never;

type ConvertOr<T extends any[]> =
  | ConvertOr0<T>
  | ConvertOr1<T>
  | ConvertOr2<T>
  | ConvertOr3<T>
  | ConvertOr4<T>
  | ConvertOr5<T>;
type ConvertOr0<T extends any[]> = T extends [] ? never : never;
type ConvertOr1<T extends any[]> = T extends [infer A] ? A : never;
type ConvertOr2<T extends any[]> = T extends [infer A, infer B] ? A | B : never;
type ConvertOr3<T extends any[]> = T extends [infer A, infer B, infer C]
  ? A | B | C
  : never;
type ConvertOr4<T extends any[]> = T extends [
  infer A,
  infer B,
  infer C,
  infer D
]
  ? A | B | C | D
  : never;
type ConvertOr5<T extends any[]> = T extends [
  infer A,
  infer B,
  infer C,
  infer D,
  infer E
]
  ? A | B | C | D | E
  : never;

type Last<T extends any[]> =
  | Last0<T>
  | Last1<T>
  | Last2<T>
  | Last3<T>
  | Last4<T>
  | Last5<T>;
type Last0<T extends any[]> = T extends [] ? never : never;
type Last1<T extends any[]> = T extends [infer A] ? A : never;
type Last2<T extends any[]> = T extends [infer _, infer A] ? A : never;
type Last3<T extends any[]> = T extends [infer _, infer __, infer A]
  ? A
  : never;
type Last4<T extends any[]> = T extends [infer _, infer __, infer ___, infer A]
  ? A
  : never;
type Last5<T extends any[]> = T extends [
  infer _,
  infer __,
  infer ___,
  infer ___,
  infer A
]
  ? A
  : never;
