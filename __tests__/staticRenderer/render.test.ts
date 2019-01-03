import render from '../../src/staticRenderer/render';
import { buildFile } from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
    const actual = render({
      currentFileId: file.id,
      files: [file],
      markdown: {
        currentFileId: file.id,
        files: [file],
      },
    });

    expect(actual).toMatchSnapshot();
  });
});
