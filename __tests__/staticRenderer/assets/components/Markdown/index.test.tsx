import { shallow } from 'enzyme';
import React from 'react';
import {
  buildJSX,
  Markdown,
} from '../../../../../src/staticRenderer/assets/components/Markdown';
import { buildFile } from '../../../../__fixtures__';

describe(Markdown, () => {
  it('renders correctly', () => {
    const files = [buildFile({ id: 'test1', content: '[[foo]]' })];
    const actual = shallow(
      <Markdown currentFileId={files[0].id} files={files} />,
    );

    expect(actual).toMatchSnapshot();
  });

  it('throw Error when file does not exist', () => {
    const actual = () =>
      shallow(<Markdown currentFileId="does_not_exist" files={[]} />);

    expect(actual).toThrowError();
  });
});

describe(buildJSX, () => {
  it('renders correctly', () => {
    const actual = buildJSX('[[foo]]');

    expect(actual).toMatchSnapshot();
  });
});
