import { shallow } from 'enzyme';
import React from 'react';
import TreeView from '../../../../../src/staticRenderer/assets/components/TreeView';
import { buildFile, buildOutputContext } from '../../../../__fixtures__';

describe(TreeView, () => {
  it('renders correctly', () => {
    const contexts = [
      buildOutputContext({ name: 'test1', path: '/test1' }),
      buildOutputContext({ name: 'test2', path: '/test2' }),
    ];
    const files = [
      buildFile({ id: 'test1', namespace: 'test1', path: '/' }),
      buildFile({ id: 'test1', namespace: 'test1', path: '/foo.md' }),
      buildFile({ id: 'test2', namespace: 'test2', path: '/' }),
    ];
    const wrapper = shallow(<TreeView contexts={contexts} files={files} />);

    expect(wrapper.find('ul > TreeViewItem').length === 2);
    expect(wrapper).toMatchSnapshot();
  });

  it('throw Error when context does not exist', () => {
    const files = [buildFile({ id: 'test1', path: '/' })];
    const wrapper = () => shallow(<TreeView contexts={[]} files={files} />);

    expect(wrapper).toThrowError();
  });
});
