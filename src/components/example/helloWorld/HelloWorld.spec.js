import React from 'react';
import { shallow } from 'enzyme';

import HelloWorld from './HelloWorld.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<HelloWorld/>);
});

describe('<HelloWorld/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
    test('renders one <h1>', () =>
    {
        expect(wrapper.find('h1')).toHaveLength(1);
    });
    test('renders [rainbow] correctly', () =>
    {
        wrapper.setProps({ rainbow: true });
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<HelloWorld/> interaction', () =>
{
    test('should change rainbow when clicked', () =>
    {
        expect(wrapper.state('rainbow')).toBe(false);
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(false);
        wrapper.simulate('click');
        expect(wrapper.state('rainbow')).toBe(true);
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(true);
    });
    test('should toggle rainbow when clicked', () =>
    {
        wrapper.simulate('click');
        expect(wrapper.state('rainbow')).toBe(true);
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(true);
        wrapper.simulate('click');
        expect(wrapper.state('rainbow')).toBe(false);
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(false);
    });
    test('should keep rainbow when set props', () =>
    {
        wrapper.setProps({ rainbow: true });
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(true);
        wrapper.simulate('click');
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(true);
        wrapper.simulate('click');
        expect(wrapper.find('h1').hasClass('rainbow')).toBe(true);
    });
});
