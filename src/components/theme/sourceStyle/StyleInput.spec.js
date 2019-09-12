import React from 'react';
import { shallow } from 'enzyme';

import StyleInput from './StyleInput.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(
        <StyleInput
            source={{ current: null }}
            name="" />
    );
});

describe('<StyleInput/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<StyleInput/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<StyleInput/> lifecycle', () =>
{
    /** ...later. */
});
