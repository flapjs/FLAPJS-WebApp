import React from 'react';
import { shallow } from 'enzyme';

import App from './App.jsx';

// TODO: Remove this "eslint-disable" in the future.
// eslint-disable-next-line no-unused-vars
let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<App/>);
});

describe('<App/> rendering', () =>
{
    test('renders correctly', () =>
    {
        // NOTE: This doesn't really do anything other
        // than tell us what we already know.
        // We should write a proper test instead.
        
        // expect(wrapper).toMatchSnapshot();
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
