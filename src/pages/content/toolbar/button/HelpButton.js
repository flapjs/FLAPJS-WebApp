//https://material.io/tools/icons/?search=help&icon=help&style=outline
import React from 'react';

class HelpButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {
    if (this.props.app.notification.hasMessages())
    {
      this.props.app.notification.addMessage("You need help. Unfortunately, I am not qualified to provide such assistance. Please refer to your local tutor/developer for more information.");
      this.props.app.notification.addMessage("Thank you for being awesome :3");
    }
    else
    {
      this.props.app.notification.addMessage("I see you want help. I'm not sure I want to help you after you so rudely got rid of all my other messages.");
    }
  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-help"
                   onClick={this.onClick.bind(this)}>
      <svg className="navicons" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g id="Bounding_Boxes">
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,19h-2v-2h2V19z M15.07,11.25l-0.9,0.92 C13.45,12.9,13,13.5,13,15h-2v-0.5c0-1.1,0.45-2.1,1.17-2.83l1.24-1.26C13.78,10.05,14,9.55,14,9c0-1.1-0.9-2-2-2s-2,0.9-2,2H8 c0-2.21,1.79-4,4-4s4,1.79,4,4C16,9.88,15.64,10.68,15.07,11.25z"/>
        </g>
      </svg>
    </button>;
  }
}

export default HelpButton;
