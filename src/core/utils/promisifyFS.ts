import 'fs';
import { promisify } from 'util';
import { FS, PromisifiedFS } from '../types';

export default function promisifyFS(fs: FS): PromisifiedFS {
  const promisifiedReaddir: any = promisify(fs.readdir);
  const promisifiedReadFile: any = promisify(fs.readFile);

  return {
    ...fs,
    lstat: promisify(fs.lstat),
    readdir: promisifiedReaddir,
    readFile: promisifiedReadFile,
  };
}
