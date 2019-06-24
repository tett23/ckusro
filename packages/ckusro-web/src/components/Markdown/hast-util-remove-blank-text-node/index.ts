import { Hast, HastElementChild, HastRoot } from '../Hast';

export type HastUtilBlankTextNodeOptions = {};

export default function hastUtilBlankTextNode(
  root: HastRoot,
  _option?: HastUtilBlankTextNodeOptions,
) {
  return removeBlankTextNode(root);
}

function removeBlankTextNode(node: Hast): Hast | null {
  switch (node.type) {
    case 'root': {
      node.children = node.children
        .map(removeBlankTextNode)
        .filter(Boolean) as HastElementChild[];

      return node;
    }
    case 'element': {
      node.children = node.children
        .map(removeBlankTextNode)
        .filter(Boolean) as HastElementChild[];

      return node;
    }
    case 'text': {
      if (node.value.trim().length === 0) {
        return null;
      }

      return node;
    }
    case 'comment': {
      return node;
    }
    case 'doctype': {
      return node;
    }
    default:
      return node;
  }
}
