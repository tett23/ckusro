import '@babel/polyfill';
import 'core-js/fn/array/flat-map';
import 'core-js/fn/array/flatten';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.setTimeout(5000);

Enzyme.configure({ adapter: new Adapter() });
