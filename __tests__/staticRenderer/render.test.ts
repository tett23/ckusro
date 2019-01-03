import render from '../../src/staticRenderer/render';
import { buildFile, buildLoaderContext } from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
    const contexts = [buildLoaderContext({ name: file.namespace })];
    const actual = render({
      contexts,
      files: [file],
      markdown: {
        currentFileId: file.id,
        files: [file],
      },
    });

    expect(actual).toMatchSnapshot();
  });
});
