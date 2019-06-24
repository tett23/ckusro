import { HastRoot } from '../Hast';
import hastUtilBlankTextNode, {
  HastUtilBlankTextNodeOptions,
} from '../hast-util-remove-blank-text-node';

export default function rehypeRemoveBlankTextNode(
  options?: HastUtilBlankTextNodeOptions,
) {
  return (tree: HastRoot) => transformer(options, tree);
}

function transformer(
  options: HastUtilBlankTextNodeOptions | undefined,
  tree: HastRoot,
) {
  return hastUtilBlankTextNode(tree, options);
}
