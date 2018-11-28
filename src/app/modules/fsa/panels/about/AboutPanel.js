import React from 'react';

class AboutPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;
  }

  //Override
  render()
  {
    return <div className="panel-container" id="about" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>Finite State Automata</h1>
      </div>
      <div className="panel-content">
        <p>Brought to you with love by the Flap.js team.</p>
      </div>
      <div className="panel-bottom"></div>
    </div>;
  }
}

export default AboutPanel;
