import { shallow } from 'enzyme';
import React from 'react';
import {
  buildJSX,
  Markdown,
} from '../../../../../../../../src/cli/renderers/staticRenderer/assets/components/MarkdownContainer/Markdown/index';
import { defaultPluginsConfig } from '../../../../../../../../src/models/DefaultPluginConfig';
import defaultPlugins from '../../../../../../../../src/models/plugins/defaultPlugins';
import parserInstance from '../../../../../../../../src/parserInstance';
import { buildFileBuffer } from '../../../../../../../__fixtures__';

describe(Markdown, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('renders correctly', () => {
    const files = [buildFileBuffer({ id: 'test1', content: '[[foo]]' })];
    const actual = shallow(
      <Markdown
        parserInstance={parserInstance(plugins)}
        fileBuffer={files[0]}
        fileBuffers={files}
      />,
    );

    expect(actual).toMatchSnapshot();
  });

  // it('throw Error when file does not exist', () => {
  //   const actual = () =>
  //     shallow(
  //       <Markdown
  //         plugins={plugins}
  //         currentFileBufferId="does_not_exist"
  //         fileBuffers={[]}
  //       />,
  //     );

  //   expect(actual).toThrowError();
  // });
});

describe(buildJSX, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('renders correctly', () => {
    const actual = buildJSX(parserInstance(plugins), '[[foo]]');

    expect(actual).toMatchSnapshot();
  });
});
