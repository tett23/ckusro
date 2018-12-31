import render from '../../src/staticRenderer/render';
import { buildFile } from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
    const actual = render({
      fileId: file.id,
      files: [file],
    });

    expect(actual).toMatchSnapshot();
  });
});
