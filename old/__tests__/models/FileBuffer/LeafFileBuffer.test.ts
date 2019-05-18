import { FileBufferTypeAny } from '../../../src/models/FileBuffer';
import { filterLeafFileBuffer } from '../../../src/models/FileBuffer/LeafFileBuffer';
import { buildFileBuffer } from '../../__fixtures__';

describe(filterLeafFileBuffer, () => {
  it('returns LeafFileBuffer[]', () => {
    const fileBuffers = [
      buildFileBuffer(),
      buildFileBuffer({ _type: FileBufferTypeAny }),
    ];
    const actual = filterLeafFileBuffer(fileBuffers);
    const expected = [fileBuffers[0]];

    expect(actual).toEqual(expected);
  });
});
