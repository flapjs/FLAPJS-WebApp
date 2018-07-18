import React from 'react';

class UndoButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {
    this.props.eventHistory.undo();
  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-undo"
      onClick={this.onClick.bind(this)}>
      <svg className="navicons"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <g id="Bounding_Boxes">
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <path d="M12.5,8c-2.65,0-5.05,0.99-6.9,2.6L2,7v9h9l-3.62-3.62c1.39-1.16,3.16-1.88,5.12-1.88c3.54,0,6.55,2.31,7.6,5.5l2.37-0.78 C21.08,11.03,17.15,8,12.5,8z"/>
        </g>
      </svg>
    </button>;
  }
}

export default UndoButton;
