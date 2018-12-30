import React from 'react';

class AboutPanel extends React.Component
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
        className={this.props.className}
        style={this.props.style}>
        <label>HEllo</label>
      </div>
    );
  }
}

export default AboutPanel;
