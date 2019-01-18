import React from 'react';
import { shallow } from 'enzyme';

import IconButton from './IconButton.js';

describe("IconButton tests", () => {
  //Test props
  test("can define id by props", () => {
    const id = "SomeID";
    const wrapper = shallow(<IconButton id={id}/>);

    expect(wrapper.prop("id")).toBe(id);
  });
  test("can define className by props", () => {
    const className = "SomeClassName";
    const wrapper = shallow(<IconButton className={className}/>);

    expect(wrapper.hasClass(className)).toBe(true);
  });
  test("can define style by props", () => {
    const style = {display: "block", margin: 0};
    const wrapper = shallow(<IconButton style={style}/>);

    expect(wrapper.prop('style')).toEqual(style);
  });
  test("can be disabled by props", () => {
    const wrapper = shallow(<IconButton disabled={true}/>);

    expect(wrapper.prop('disabled')).toBe(true);
  });
  test("can set title by props", () => {
    const title = "SomeTitle";
    const wrapper = shallow(<IconButton title={title}/>);

    expect(wrapper.prop('title')).toBe(title);
  });
  test("can listen onclick by props", () => {
    const clickEvent = {};
    const onClick = jest.fn();
    const wrapper = shallow(<IconButton onClick={onClick}/>);

    wrapper.simulate('click', clickEvent);
    expect(onClick).toBeCalledWith(clickEvent);
  });

  //Test components
  test("check container component type", () => {
    const wrapper = shallow(<IconButton/>);

    expect(wrapper.type()).toBe('button');
  });
  test("display title in a label", () => {
    const buttonTitle = "SomeTitle";
    const wrapper = shallow(<IconButton title={buttonTitle}/>);

    expect(wrapper.prop('title')).toBe(buttonTitle);
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe(buttonTitle);
  });
  test("check default hint for SHOW_LABEL", () => {
    const wrapper = shallow(<IconButton/>);

    expect(wrapper.hasClass("hint")).toBe(false);
  });
  test("check set hint for SHOW_LABEL", () => {
    IconButton.SHOW_LABEL = true;
    const wrapper = shallow(<IconButton/>);
    expect(wrapper.hasClass("hint")).toBe(false);
    IconButton.SHOW_LABEL = false;
  });
});
