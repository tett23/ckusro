import { createHash } from 'crypto';

export default function shasum(buffer: Buffer) {
  return createHash('sha1')
    .update(buffer)
    .digest('hex');
}
