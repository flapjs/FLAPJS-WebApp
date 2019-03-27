import React from 'react';
import InputAdapter from '../InputAdapter.js';
import AbstractInputHandler from '../AbstractInputHandler.js';

const DEFAULT_VIEW_SIZE = 300;

class ViewportComponent extends React.Component
{
  constructor(props)
  {
    super(props);

    this._ref = React.createRef();

    this._inputAdapter = new InputAdapter();
  }

  addInputHandler(inputHandler)
  {
    if (!(inputHandler instanceof AbstractInputHandler)) throw new Error("input handler must be an instanceof AbstractInputHandler");
    this._inputAdapter.addInputHandler(inputHandler);
    return this;
  }

  //Override
  componentDidMount()
  {
    this._inputAdapter.initialize(this._ref.current);
  }

  //Override
  componentWillUnmount()
  {
    this._inputAdapter.terminate();
  }

  getSVGTransformString()
  {
    const viewport = this._inputAdapter.getViewport();
    return "translate(" + viewport.getOffsetX() + " " + viewport.getOffsetY() + ")";
  }

  getSVGViewBoxString(baseViewSize)
  {
    const viewport = this._inputAdapter.getViewport();
    const viewSize = baseViewSize * Math.max(Number.MIN_VALUE, viewport.getScale());
    const halfViewSize = viewSize / 2;
    return (-halfViewSize) + " " + (-halfViewSize) + " " + viewSize + " " + viewSize;
  }

  getSVGElement()
  {
    return this._ref.current;
  }

  getInputAdapter()
  {
    return this._inputAdapter;
  }

  //Override
  render()
  {
    this._inputAdapter.update();

    const viewBox = this.getSVGViewBoxString(this.props.viewSize || DEFAULT_VIEW_SIZE);
    const transform = this.getSVGTransformString();

    return (
      <svg ref={this._ref}
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        viewBox={viewBox} transform={transform}>
        {this.props.children}
      </svg>
    );
  }
}

export default ViewportComponent;
