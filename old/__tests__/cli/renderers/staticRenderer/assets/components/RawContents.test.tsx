import { shallow } from 'enzyme';
import React from 'react';
import RawContents from '../../../../../../src/cli/renderers/staticRenderer/assets/components/RawContents';
import { FileTypeMarkdown } from '../../../../../../src/models/CkusroFile';
import { FileBuffer } from '../../../../../../src/models/FileBuffer';
import { buildFileBuffer } from '../../../../../__fixtures__';

describe(RawContents, () => {
  it('renders <RawContent />', () => {
    const files: FileBuffer[] = [
      buildFileBuffer({
        fileType: FileTypeMarkdown,
        path: '/foo.md',
        content: 'foo',
      }),
    ];

    const wrapper = shallow(<RawContents fileBuffers={files} />).children();

    expect(wrapper.length).toBe(1);
    expect(wrapper.at(0).name()).toBe('RawContent');
    expect(wrapper.at(0).prop('file').path).toBe('/foo.md');
  });

  it('renders <RawContent /> join with <hr /> when provide multiple file', () => {
    const files: FileBuffer[] = [
      buildFileBuffer({
        fileType: FileTypeMarkdown,
        path: '/foo.md',
        content: 'foo',
      }),
      buildFileBuffer({
        fileType: FileTypeMarkdown,
        path: '/bar.md',
        content: 'bar',
      }),
    ];

    const wrapper = shallow(<RawContents fileBuffers={files} />).children();

    expect(wrapper.length).toBe(3);

    const content1 = wrapper.at(0);
    expect(content1.name()).toBe('RawContent');
    expect(content1.prop('file').path).toBe('/foo.md');

    const hr = wrapper.at(1);
    expect(hr.name()).toBe('hr');

    const content2 = wrapper.at(2);
    expect(content2.name()).toBe('RawContent');
    expect(content2.prop('file').path).toBe('/bar.md');
  });

  it('renders <EmptyContent /> when content is null', () => {
    const files: FileBuffer[] = [
      buildFileBuffer({
        fileType: FileTypeMarkdown,
        content: null,
      }),
    ];

    const wrapper = shallow(<RawContents fileBuffers={files} />).children();

    expect(wrapper.length).toBe(1);
    expect(wrapper.at(0).name()).toBe('EmptyContent');
  });
});
