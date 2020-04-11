import { UnpersistedGitObject, GitObjectTypes } from './index';
import { toBuffer } from './toBuffer';
import shasum from './shasum';
// import { hashBlob } from 'isomorphic-git';

export type OidInflatedObject = [string, Buffer];

export async function objectDigest<T extends UnpersistedGitObject>(
  gitObject: T,
): Promise<string | Error> {
  const buf = toBuffer(gitObject);
  if (buf instanceof Error) {
    return buf;
  }

  // const result = await (async () =>
  //   hashBlob({ object: gitObject.content as any }))().catch(
  //   (err: Error) => err,
  // );
  // if (result instanceof Error) {
  //   return result;
  // }

  // return result.oid;
  const inflated = toInflatedObject(gitObject.type, buf);
  const oid = shasum(inflated);

  return oid;
}

function toInflatedObject(objectType: GitObjectTypes, buffer: Buffer): Buffer {
  return Buffer.concat([
    Buffer.from(`${objectType} ${buffer.byteLength.toString()}\x00`),
    buffer,
  ]);
}
