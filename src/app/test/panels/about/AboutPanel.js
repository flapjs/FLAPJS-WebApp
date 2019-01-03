import React from 'react';
import Style from './AboutPanel.css';

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
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{"Finite State Automata"}</h1>
        </div>
        <div className={Style.panel_content}>
          <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
          <p>{"<- Tap on a tab to begin!"}</p>
        </div>
      </div>
    );
  }
}

export default AboutPanel;
