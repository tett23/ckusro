import { promisify } from 'util';
import { FS, PromisifiedFS } from '../types';

export default function promisifyFS(fs: FS): PromisifiedFS {
  const promisifiedReaddir: any = promisify(fs.readdir);

  return { ...fs, lstat: promisify(fs.lstat), readdir: promisifiedReaddir };
}
