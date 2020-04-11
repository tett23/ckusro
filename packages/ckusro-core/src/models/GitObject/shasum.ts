import { createHash } from 'crypto';

export default async function shasum(buffer: Buffer) {
  return createHash('sha1').update(buffer).digest('hex');
}
