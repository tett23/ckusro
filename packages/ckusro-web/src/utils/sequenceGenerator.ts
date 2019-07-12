export default function* sequenceGenerator(): IterableIterator<number> {
  let n = 0;

  while (true) {
    n++;
    yield n;
  }
}
