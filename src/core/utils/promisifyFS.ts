import { promisify } from 'util';
import { FS, PromisifiedFS } from '../types';

export default function promisifyFS(fs: FS): PromisifiedFS {
  return { ...fs, lstat: promisify(fs.lstat) };
}
