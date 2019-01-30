import '@babel/polyfill';
import 'core-js/modules/esnext.array.flat';
import 'core-js/modules/esnext.array.flat-map';
import Enzyme from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';

jest.setTimeout(5000);

Enzyme.configure({ adapter: new ReactSixteenAdapter() });
