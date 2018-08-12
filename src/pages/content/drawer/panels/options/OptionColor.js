import React from 'react';
import './OptionColor.css';

import ColorHelper from 'util/ColorHelper.js';

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

    if (this.props.invert)
    {
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.RGBtoHSV(...color, color);
      //INVERT HUE: color[0] = (color[0] + 0.5) % 1;
      //INVERT BRIGHTNESS:
      color[2] = 1 - color[2];
      ColorHelper.HSVtoRGB(...color, color);
      const result = ColorHelper.RGBtoHEX(...color);
      style.setProperty(name + "-invert", result);
    }

    if (this.props.dark)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.RGBtoHSV(...color, color);
      color[2] *= 0.8;
      ColorHelper.HSVtoRGB(...color, color);
      const result = ColorHelper.RGBtoHEX(...color);
      style.setProperty(name + "-dark", result);
    }

    if (this.props.subtle)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.RGBtoHSV(...color, color);
      color[2] *= 0.61;
      ColorHelper.HSVtoRGB(...color, color);
      const result = ColorHelper.RGBtoHEX(...color);
      style.setProperty(name + "-subtle", result);
    }

    if (this.props.ghost)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.RGBtoHSV(...color, color);
      color[2] *= 0.74;
      ColorHelper.HSVtoRGB(...color, color);
      const result = ColorHelper.RGBtoHEX(...color);
      style.setProperty(name + "-ghost", result);
    }

    if (this.props.back)
    {
      //v < 0.15 ? lighten : darken
      const color = [];
      ColorHelper.HEXtoRGB(value, color);
      ColorHelper.RGBtoHSV(...color, color);
      color[2] *= 0.87;
      ColorHelper.HSVtoRGB(...color, color);
      const result = ColorHelper.RGBtoHEX(...color);
      style.setProperty(name + "-back", result);
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
