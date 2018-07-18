import React from 'react';

class RedoButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {
    this.props.eventHistory.redo();
  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-redo"
      onClick={this.onClick.bind(this)}>
      <svg className="navicons"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <g id="Bounding_Boxes">
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <path d="M18.4,10.6C16.55,8.99,14.15,8,11.5,8c-4.65,0-8.58,3.03-9.96,7.22L3.9,16c1.05-3.19,4.05-5.5,7.6-5.5 c1.95,0,3.73,0.72,5.12,1.88L13,16h9V7L18.4,10.6z"/>
        </g>
      </svg>
    </button>;
  }
}

export default RedoButton;
