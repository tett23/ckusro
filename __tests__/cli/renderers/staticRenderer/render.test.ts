import render from '../../../../src/cli/renderers/staticRenderer/render';
import { buildFileBuffer, buildGlobalState } from '../../../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFileBuffer();
    const globalState = buildGlobalState();
    const actual = render({
      globalState,
      fileBuffers: [file],

      markdown: {
        currentFileId: file.id,
        files: [file],
      },
    });

    expect(actual).toMatchSnapshot();
  });
});
