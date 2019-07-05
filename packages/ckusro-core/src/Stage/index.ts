import FS from 'fs';
import {
  UnsavedBlobBufferInfo,
  UnsavedTreeBufferInfo,
} from '../models/BufferInfo';
import { CkusroConfig } from '../models/CkusroConfig';

export function stage(config: CkusroConfig, fs: typeof FS) {
  return {
    write: (bufferInfo: UnsavedTreeBufferInfo | UnsavedBlobBufferInfo) =>
      write(config, fs, bufferInfo),
  };
}

function write<T extends UnsavedTreeBufferInfo | UnsavedBlobBufferInfo>(
  _: CkusroConfig,
  __: typeof FS,
  ___: T,
) {}

// export async function write<
//   T extends UnsavedTreeBufferInfo | UnsavedBlobBufferInfo
// >(
//   config: CkusroConfig,
//   fs: typeof FS,
//   bufferInfo: T,
// ): Promise<T & { oid: string } | Error> {
//   const prepareResult = await prepareRepository(config, fs);
//   if (prepareResult instanceof Error) {
//     return prepareResult;
//   }

//   const tree = await headTree(config);
//   if (tree instanceof Error) {
//     return tree;
//   }

//   const paths = createInternalPath(bufferInfo.internalPath).split();
//   const parent = paths.slice(0, -1);
//   const [tail] = paths.slice(-1);

//   const ps = parent.map(async (path) => fetchOrCreate(config, path));
//   const [parentTree] = (await Promise.all(ps)).slice(-1);
//   if (parentTree instanceof Error) {
//     return parentTree;
//   }

//   const rootTree = await writeContent(config, parents, bufferInfo, '');
//   if (rootTree instanceof Error) {
//     return rootTree;
//   }
// }

// export async function writeContent(
//   config: CkusroConfig,
//   parents: TreeObject[],
//   bufferInfo: UnsavedBlobBufferInfo | UnsavedTreeBufferInfo,
//   content: Buffer,
// ): Promise<TreeObject | Error> {
//   if (bufferInfo.type === 'blob') {
//     return writeBlob(config, parents, bufferInfo, content);
//   }

//   return writeTree(config, parents, bufferInfo, content);
// }

// export async function writeBlob(
//   config: CkusroConfig,
//   parents: TreeObject[],
//   bufferInfo: UnsavedBlobBufferInfo,
//   content: Buffer,
// ): Promise<TreeObject | Error> {
//   const blobOid = await Git.writeObject({
//     core: config.coreId,
//     gitdir: config.stage,
//     type: 'blob',
//     object: content,
//   }).catch((err: Error) => err);
//   if (blobOid instanceof Error) {
//     return blobOid;
//   }

//   const [parent] = parents.slice(-1);
//   const head = parents.slice(0, -1);
//   const parentOid = await Git.writeObject({
//     core: config.coreId,
//     gitdir: config.stage,
//     type: 'tree',
//     object: {
//       entries: [
//         ...parent.content,
//         {
//           type: 'blob',
//           mode: '100644',
//           path: basename(bufferInfo.internalPath.path),
//           oid: blobOid,
//         },
//       ],
//     },
//   }).catch((err: Error) => err);
//   if (parentOid instanceof Error) {
//     return parentOid;
//   }

//   const rootTree = head.reverse().reduce(
//     async (acc: [string, TreeObject] | Error, path) => {
//       if (acc instanceof Error) {
//         return acc;
//       }
//       const [changedOid, te] = acc;

//       const entries = [
//         ...te.content,
//         {
//           type: 'tree',
//           mode: '100644',
//           path: path,
//           oid: changedOid,
//         },
//       ];

//       const parentOid = await Git.writeObject({
//         core: config.coreId,
//         gitdir: config.stage,
//         type: 'tree',
//         object: {
//           entries,
//         },
//       }).catch((err: Error) => err);
//       if (parentOid instanceof Error) {
//         return parentOid;
//       }

//       return [
//         parentOid,
//         {
//           type: 'tree',
//           oid: parentOid,
//           content: entries,
//         },
//       ];
//     },
//     [parentOid, parent],
//   );
//   if (rootTree instanceof Error) {
//     return rootTree;
//   }

//   return rootTree;
// }
