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
    const currentModule = this.props.currentModule;

    return (
      <PanelContainer id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={"Your Average Graph Editor"}>
        <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
        <p>{"You do you. ;)"}</p>
      </PanelContainer>
    );
  }
}

export default AboutPanel;
