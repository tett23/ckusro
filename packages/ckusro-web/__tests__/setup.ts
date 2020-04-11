import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import { TextDecoder } from 'util';

jest.setTimeout(5000);

(global as any).TextDecoder = TextDecoder; // eslint-disable-line @typescript-eslint/no-explicit-any
