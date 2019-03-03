import React from 'react';
import Style from './AboutPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';

class AboutPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const session = this.props.session;

    return (
      <PanelContainer id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={"Finite State Automata"}>
        <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
        <p>{"<- Tap on a tab to begin!"}</p>
      </PanelContainer>
    );
  }
}

export default AboutPanel;
