import { shallow } from 'enzyme';
import React from 'react';
import TreeView from '../../../../../src/staticRenderer/assets/components/TreeView';
import { buildFile } from '../../../../__fixtures__';

describe(TreeView, () => {
  it('renders correctly', () => {
    const files = [
      buildFile({ id: 'test1', namespace: 'test1', path: '/' }),
      buildFile({ id: 'test1', namespace: 'test1', path: '/foo.md' }),
      buildFile({ id: 'test2', namespace: 'test2', path: '/' }),
    ];
    const wrapper = shallow(<TreeView currentId="test1" files={files} />);

    expect(wrapper.find('ul > TreeViewItem').length === 2);
    expect(wrapper).toMatchSnapshot();
  });

  it('throw Error when currentId file does not exist', () => {
    const files = [buildFile({ id: 'test1' })];
    const wrapper = () =>
      shallow(<TreeView currentId="does_not_exist" files={files} />);

    expect(wrapper).toThrowError();
  });
});
