import React from 'react';

class DefaultDrawerPanel extends React.Component
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
        <div>
          <h1 style={{margin: 0}}>{DefaultDrawerPanel.TITLE}</h1>
          <p>Here is some content.</p>
        </div>
      </div>
    );
  }
}
DefaultDrawerPanel.TITLE = "Panel";
DefaultDrawerPanel.HIDDEN = false;

export default DefaultDrawerPanel;
