import { mount } from 'enzyme';
import React from 'react';
import { Markdown } from '../../../../../src/staticRenderer/assets/components/Markdown';

describe(Markdown, () => {
  it('', () => {
    const text = '[[foo]]';
    const actual = mount(<Markdown text={text} />);

    expect(actual).toMatchSnapshot();
  });
});
