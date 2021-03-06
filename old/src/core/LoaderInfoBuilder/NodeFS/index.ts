import fs from 'fs';
import { FS } from '../../types';

export default {
  lstat: fs.lstat,
  readdir: fs.readdir,
  readFile: fs.readFile,
} as FS;
