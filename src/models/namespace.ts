import { LoaderConfig } from './ckusroConfig/LoaderConfig';
import { LoaderContext } from './loaderContext';
import { OutputContext } from './outputContext';

export type Namespace = {
  name: string;
  loaderContext: LoaderContext;
  outputContext: OutputContext;
  loaderConfig: LoaderConfig;
};
