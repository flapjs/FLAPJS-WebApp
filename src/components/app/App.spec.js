import React from 'react';
import { shallow } from 'enzyme';

import App from './App.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<App/>);
});

describe('<App/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<App/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<App/> lifecycle', () =>
{
    /** ...later. */
});
