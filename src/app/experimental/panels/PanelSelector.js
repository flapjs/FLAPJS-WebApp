import React from 'react';
import Style from './PanelSelector.css';

class PanelSelector extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={Style.panel_selector +
          " " + this.props.className}
        style={this.props.style}>
        <select>
          {this.props.children}
        </select>
      </div>
    );
  }
}

export default PanelSelector;
