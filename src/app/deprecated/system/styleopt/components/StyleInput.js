import React from 'react';

class StyleInput extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e)
  {
    const newValue = e.target.value;
    const value = this.props.value;
    const onChange = this.props.onChange;

    value.setValue(newValue);
    if (onChange) onChange(value);
  }

  //Override
  render()
  {
    const title = this.props.title;
    const value = this.props.value;
    // const propName = value.prop;
    const propName = value.getName();
    const inputType = "color";
    const inputID = "styleopt-" + propName;

    return <span id={this.props.id} className={this.props.className} style={this.props.style}>
      <input id={inputID} type={inputType} value={value.getValue()} onChange={this.onChange} disabled={this.props.disabled}/>
      <label htmlFor={inputID}>{title}</label>
    </span>;
  }
}
export default StyleInput;
