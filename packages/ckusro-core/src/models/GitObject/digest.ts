import { GitObject, GitObjectTypes } from './index';
import shasum from './shasum';
import { toBuffer } from './toBuffer';

export type OidInflatedObject = [string, Buffer];

export function objectDigest<T extends GitObject>(
  gitObject: T,
): OidInflatedObject | Error {
  const buf = toBuffer(gitObject);
  if (buf instanceof Error) {
    return buf;
  }

  const inflated = toInflatedObject(gitObject.type, buf);
  const oid = shasum(inflated);

  return [oid, inflated];
}

function toInflatedObject(objectType: GitObjectTypes, buffer: Buffer): Buffer {
  return Buffer.concat([
    Buffer.from(`${objectType} ${buffer.byteLength.toString()}\x00`),
    buffer,
  ]);
}
