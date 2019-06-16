import { CkusroConfig } from '../models/CkusroConfig';
import buildAst from './buildAst';

export function parser(config: CkusroConfig) {
  return {
    buildAst: (content: string) => buildAst(config.plugins, content),
  };
}
