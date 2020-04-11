import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import http from 'isomorphic-git/http/node';
import { setHttpClient } from '../src/utils/httpClient';

jest.setTimeout(5000);

setHttpClient(http);
