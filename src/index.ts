import { mergeConfig } from './config';
import { load } from './loader';

export default function main() {
  const config = mergeConfig({});
  load(config.targetDirectory, config.loader.extensions);
}

main();
