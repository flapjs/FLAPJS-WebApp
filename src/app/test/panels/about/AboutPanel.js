import React from 'react';
import Style from './AboutPanel.css';

import PanelSection from 'test/panels/PanelSection.js';

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
          <PanelSection title={"Meet the Team"}>
            <h2>The Team</h2>
            <ul>
              <li>{"David Osuna"}</li>
            </ul>
            <h2>The OG Team</h2>
            <ul>
              <li>{"David Osuna"}</li>
            </ul>
            <h2>Past Teams</h2>
            <ul>
              <li>{"David Osuna"}</li>
            </ul>
          </PanelSection>
          <PanelSection title={"Special Thanks"}>
            <ul>
              <li>{"To the UCSD Summer Internship Program for gathering us together,"}</li>
              <li>{"To the CSE Building Room Reservation people for their hard work,"}</li>
              <li>{"To our friends and family,"}</li>
              <li>{"And finally, to you. Thank you for using Flap.js!"}</li>
            </ul>
          </PanelSection>
        </div>
      </div>
    );
  }
}

export default AboutPanel;
