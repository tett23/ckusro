import { shallow } from 'enzyme';
import React from 'react';
import {
  CkusroFile,
  FileTypeMarkdown,
} from '../../../../src/models/ckusroFile';
import RawContents from '../../../../src/staticRenderer/assets/components/RawContents';
import { buildFile } from '../../../__fixtures__';

describe(RawContents, () => {
  it('renders <RawContent />', () => {
    const files: CkusroFile[] = [
      buildFile({
        name: 'foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: 'foo',
      }),
    ];

    const wrapper = shallow(<RawContents files={files} />).children();

    expect(wrapper.length).toBe(1);
    expect(wrapper.at(0).name()).toBe('RawContent');
    expect(wrapper.at(0).prop('file').name).toBe('foo.md');
  });

  it('renders <RawContent /> join with <hr /> when provide multiple file', () => {
    const files: CkusroFile[] = [
      buildFile({
        name: 'foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: 'foo',
      }),
      buildFile({
        name: 'bar.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: 'bar',
      }),
    ];

    const wrapper = shallow(<RawContents files={files} />).children();

    expect(wrapper.length).toBe(3);

    const content1 = wrapper.at(0);
    expect(content1.name()).toBe('RawContent');
    expect(content1.prop('file').name).toBe('foo.md');

    const hr = wrapper.at(1);
    expect(hr.name()).toBe('hr');

    const content2 = wrapper.at(2);
    expect(content2.name()).toBe('RawContent');
    expect(content2.prop('file').name).toBe('bar.md');
  });

  it('renders <EmptyContent /> when isLoaded is false', () => {
    const files: CkusroFile[] = [
      buildFile({
        name: 'foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: false,
      }),
    ];

    const wrapper = shallow(<RawContents files={files} />).children();

    expect(wrapper.length).toBe(1);
    expect(wrapper.at(0).name()).toBe('EmptyContent');
  });

  it('renders <EmptyContent /> when content is null', () => {
    const files: CkusroFile[] = [
      buildFile({
        name: 'foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
      }),
    ];

    const wrapper = shallow(<RawContents files={files} />).children();

    expect(wrapper.length).toBe(1);
    expect(wrapper.at(0).name()).toBe('EmptyContent');
  });
});
