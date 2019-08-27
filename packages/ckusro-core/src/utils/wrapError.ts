export default function wrapError(err: Error): Error & { o: Error } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ret: any = new Error(err.message);
  ret.o = err;

  return ret;
}
