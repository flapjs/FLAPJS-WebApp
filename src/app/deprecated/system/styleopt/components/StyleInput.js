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

    value.setStyle(newValue);
    if (onChange) onChange(value);
  }

  /** @override */
  render()
  {
    const title = this.props.title;
    const value = this.props.value;
    const propName = value.prop;
    const inputType = value.type;
    const inputID = "styleopt-" + propName;

    return <span id={this.props.id} className={this.props.className} style={this.props.style}>
      <input id={inputID} type={inputType} value={value.getStyle()} onChange={this.onChange} disabled={this.props.disabled}/>
      <label htmlFor={inputID}>{title}</label>
    </span>;
  }
}
export default StyleInput;
