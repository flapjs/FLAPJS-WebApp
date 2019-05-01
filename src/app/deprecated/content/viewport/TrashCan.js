import React from 'react';
import './TrashCan.css';

import Viewport from './Viewport.js';

class TrashCan extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      staticTrash: false
    };
  }

  onTrashEnter(e)
  {
    if (this.state.staticTrash) return;
    this.props.inputController.setTrashMode(true);

    //Enable mode: dangerous
    this.props.viewport.setState((prev, props) => {
      return {mode: Viewport.DANGEROUS};
    });
  }

  onTrashLeave(e)
  {
    if (this.state.staticTrash) return;
    this.props.inputController.setTrashMode(false);

    //Disable mode: dangerous
    this.props.viewport.setState((prev, props) => {
      return {mode: Viewport.NORMAL};
    });
  }

  onTrashClick(e)
  {
    e.stopPropagation();
    e.preventDefault();

    this.setState((prev, props) => {
      const result = !prev.staticTrash;
      this.props.inputController.setTrashMode(result);

      //Enable mode: dangerous
      this.props.viewport.setState((prev, props) => {
        return {mode: result ? Viewport.DANGEROUS : Viewport.NORMAL};
      })

      return {
        staticTrash: result
      };
    });
  }

  render()
  {
    const inputController = this.props.inputController;
    const inputAdapter = inputController.getInputAdapter();

    return <svg id="trash-btn"
      className={(inputController.isTrashMode() ? "danger " : "") +
        (inputAdapter.isUsingTouch() && inputAdapter.isDragging() ? "hidden" : "")}
      width="24" height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={this.onTrashEnter.bind(this)}
      onMouseLeave={this.onTrashLeave.bind(this)}
      onClick={this.onTrashClick.bind(this)}>
      <path d={"M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 " +
      "1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 " +
      "1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 " +
      "1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"}/>
    </svg>;
  }
}

export default TrashCan;
