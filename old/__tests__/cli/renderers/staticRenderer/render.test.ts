/**
 * @jest-environment node
 */

import render from '../../../../src/cli/renderers/staticRenderer/render';
import { defaultPluginsConfig } from '../../../../src/models/DefaultPluginConfig';
import defaultPlugins from '../../../../src/models/plugins/defaultPlugins';
import parserInstance from '../../../../src/parserInstance';
import { buildFileBufferState } from '../../../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const plugins = defaultPlugins(defaultPluginsConfig());
    const fbState = buildFileBufferState();
    const actual = render({
      common: {
        parserInstance: parserInstance(plugins),
      },
      fileBuffers: {
        fileBuffersState: fbState,
        currentFileBufferId: fbState.fileBuffers[0].id,
      },
    });

    expect(actual).toMatchSnapshot();
  });
});
