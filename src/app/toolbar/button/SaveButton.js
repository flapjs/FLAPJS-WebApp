import React from 'react';

class SaveButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {

  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-save"
      onClick={this.onClick.bind(this)}>
      <svg className="navicons"
        width="36px" height="36px"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <g id="Bounding_Boxes">
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <g>
            <path d="M17,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V7L17,3z M19,19H5V5h11.17L19,7.83V19z"/>
            <path d="M12,12c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3C15,13.34,13.66,12,12,12z"/>
            <rect x="6" y="6" width="9" height="4"/>
          </g>
        </g>
      </svg>
    </button>;
  }
}

export default SaveButton;
