import React from 'react';
import { shallow } from 'enzyme';

import __NAME__ from './__NAME__.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<__NAME__/>);
});

describe('<__NAME__/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<__NAME__/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<__NAME__/> lifecycle', () =>
{
    /** ...later. */
});
