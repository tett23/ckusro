import { createHash } from 'crypto';

export default async function shasum(buffer: Buffer) {
  // const res = await crypto.subtle.digest('SHA-1', buffer);
  // return toHex(res);

  return createHash('sha1').update(buffer).digest('hex');
}

// export function toHex(buffer: ArrayBuffer) {
//   let hex = '';
//   for (const byte of new Uint8Array(buffer)) {
//     if (byte < 16) hex += '0';
//     hex += byte.toString(16);
//   }
//   return hex;
// }

// async function subtleSHA1(buffer: Buffer) {
//   const hash = await crypto.subtle.digest('SHA-1', buffer);
//   return toHex(hash);
// }

// async function testSubtleSHA1() {
//   // I'm using a rather crude method of progressive enhancement, because
//   // some browsers that have crypto.subtle.digest don't actually implement SHA-1.
//   try {
//     const hash = await subtleSHA1(new Buffer([]));
//     if (hash === 'da39a3ee5e6b4b0d3255bfef95601890afd80709') return true;
//   } catch (_) {
//     // no bother
//   }
//   return false;
// }
