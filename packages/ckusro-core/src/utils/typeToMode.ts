import { GitObjectTypes } from '../models/GitObject';

export default function(type: GitObjectTypes) {
  if (type === 'tree') {
    return '040000';
  }

  return '100644';
}
