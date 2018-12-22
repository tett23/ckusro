import { mergeConfig } from './config';
import { load } from './loader';

export default function main() {
  const config = mergeConfig({});
  const a = load(config.targetDirectory, config.loader.extensions);
  console.log(a);
  console.log('hogehoge');
}

main();
