import shortOid from '../../src/utils/shortOid';
import { randomOid } from '../__fixtures__';

describe(shortOid, () => {
  it('retruns string', () => {
    const oid = randomOid();
    const actual = shortOid(oid);
    const expected = oid.slice(0, 6);

    expect(actual).toBe(expected);
  });
});
