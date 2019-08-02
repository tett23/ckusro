import { BlobObject } from '@ckusro/ckusro-core';
import crypto from 'crypto';

export function createBlobObject(content: string | Buffer): BlobObject {
  let buffer: Buffer;
  if (typeof content === 'string') {
    buffer = Buffer.from(content);
  } else {
    buffer = content;
  }

  const oid = crypto
    .createHash('sha1')
    .update(buffer)
    .digest('hex');

  return {
    type: 'blob',
    oid,
    content: buffer,
  };
}
