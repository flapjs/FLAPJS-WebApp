import React from 'react';
import './OptionColor.css';

class OptionColor extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(e)
  {
    const style = this.props.root.style;
    const name = this.props.propName;
    const value = e.target.value;
    style.setProperty(name, value);

    if (this.props.dark)
    {
      style.setProperty(name + "-dark", value);
    }

    if (this.props.invert)
    {
      style.setProperty(name + "-invert", value);
    }
  }

  render()
  {
    return <div className={"option-container option-color " + this.props.className}>
      <input id="option-input" type="color"
        defaultValue={window
          .getComputedStyle(this.props.root)
          .getPropertyValue(this.props.propName)
          .trim()}
        onChange={this.onValueChange}/>
      <label htmlFor="option-input">{this.props.label}</label>
    </div>;
  }
}

export default OptionColor;
