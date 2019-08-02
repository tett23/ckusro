import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import { TextDecoder } from 'util';

jest.setTimeout(5000);

// @ts-ignore
global.TextDecoder = TextDecoder;
