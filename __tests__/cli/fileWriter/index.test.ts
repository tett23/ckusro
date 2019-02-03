jest.mock('fs');
jest.mock('mkdirp');

import fs from 'fs';
import * as mkdirp from 'mkdirp';
import writeFile from '../../../src/cli/fileWriter';
import { WriteInfo } from '../../../src/cli/models/WriteInfo';

describe(writeFile, () => {
  const writeInfo: WriteInfo = {
    path: '/test/out/baz.html',
    content: 'test content',
  };

  it('returns true', async () => {
    // @ts-ignore
    mkdirp.default.mockImplementationOnce((...args) => {
      args[args.length - 1](null, true);
    });

    // @ts-ignore
    fs.writeFile.mockImplementationOnce((...args) => {
      args[args.length - 1](null, true);
    });

    const actual = await writeFile(writeInfo);

    expect(actual).toBe(true);
  });

  it('returns Error when mkdirp failed', async () => {
    // @ts-ignore
    mkdirp.default.mockImplementationOnce((...args) => {
      args[args.length - 1](new Error());
    });

    const actual = await writeFile(writeInfo);

    expect(actual).toBeInstanceOf(Error);
  });

  it('returns Error when fs.writeFile failed', async () => {
    // @ts-ignore
    mkdirp.default.mockImplementationOnce((...args) => {
      args[args.length - 1](null, true);
    });

    // @ts-ignore
    fs.writeFile.mockImplementationOnce((...args) => {
      args[args.length - 1](new Error());
    });

    const actual = await writeFile(writeInfo);

    expect(actual).toBeInstanceOf(Error);
  });
});
