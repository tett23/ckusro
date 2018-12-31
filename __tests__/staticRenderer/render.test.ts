import render from '../../src/staticRenderer/render';
import { buildFile } from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
    const actual = render({
      file,
      files: [],
    });

    expect(actual).toMatchSnapshot();
  });
});
