import React from 'react';
import { shallow } from 'enzyme';

export function testComponentProps(ComponentClass)
{
  test("can define id by props", () => {
    const id = "SomeID";
    const wrapper = shallow(<ComponentClass id={id}/>);

    expect(wrapper.prop("id")).toBe(id);
  });
  test("can define className by props", () => {
    const className = "SomeClassName";
    const wrapper = shallow(<ComponentClass className={className}/>);

    expect(wrapper.hasClass(className)).toBe(true);
  });
  test("can define style by props", () => {
    const style = {display: "block", margin: 0};
    const wrapper = shallow(<ComponentClass style={style}/>);

    expect(wrapper.prop('style')).toEqual(style);
  });
};
