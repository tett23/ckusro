import { shallow } from 'enzyme';
import React from 'react';
import Breadcrumbs, {
  pathItems,
} from '../../../../src/staticRenderer/assets/components/Breadcrumbs';

describe(Breadcrumbs, () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Breadcrumbs namespace="namespace" path="/foo.md" />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe(pathItems, () => {
  it('returns name-path tuple', () => {
    const data: Array<[string, Array<[string, string]>]> = [
      [
        '/foo/bar/baz.md',
        [
          ['namespace', '../../..'],
          ['foo', '../..'],
          ['bar', '..'],
          ['baz.md', './'],
        ],
      ],
      ['/foo.md', [['namespace', '..'], ['foo.md', './']]],
      ['/', [['namespace', './']]],
    ];
    data.forEach(([path, expected]) => {
      const actual = pathItems('namespace', path);

      expect(actual).toEqual(expected);
    });
  });
});
