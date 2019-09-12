import React from 'react';
import { shallow } from 'enzyme';

import ComputedStyleInput from './ComputedStyleInput.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(
        <ComputedStyleInput
            source={{ current: null }}
            name=""
            compute={{ current: null }} />
    );
});

describe('<ComputedStyleInput/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<ComputedStyleInput/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<ComputedStyleInput/> lifecycle', () =>
{
    /** ...later. */
});
