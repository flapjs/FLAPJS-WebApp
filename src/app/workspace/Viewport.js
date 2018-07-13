import React from 'react';

import './Viewport.css';

class Viewport extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      fullTrashMode: false
    };
  }

  onTrashEnter(e)
  {
    if (this.state.fullTrashMode) return;
    this.props.controller.pointer.trashMode = true;

    //Enable danger mode for app
    this.props.app.setState((prev, props) => {
      return {isDangerous: true};
    });
  }

  onTrashLeave(e)
  {
    if (this.state.fullTrashMode) return;
    this.props.controller.pointer.trashMode = false;

    //Disable danger mode for app
    this.props.app.setState((prev, props) => {
      return {isDangerous: false};
    });
  }

  onTrashClick(e)
  {
    e.stopPropagation();
    e.preventDefault();

    this.setState((prev, props) => {
      const result = !prev.fullTrashMode;
      this.props.controller.pointer.trashMode = result;

      //Toggle danger mode for app
      this.props.app.setState((prev, props) => {
        return {isDangerous: result};
      });

      return {fullTrashMode: result};
    });
  }

  render()
  {
    return <div className="viewport-container">
      <svg id="trash-btn" className="anchor-bottom-right"
        width="24" height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={this.onTrashEnter.bind(this)}
        onMouseLeave={this.onTrashLeave.bind(this)}
        onClick={this.onTrashClick.bind(this)}>
        <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
      </svg>
    </div>;
  }
}

export default Viewport;
