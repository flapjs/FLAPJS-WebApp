import React from 'react';
import ReactDOM from 'react-dom';

class Draggable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      drag: {
        offset: {x: 0, y: 0},
        transform: null,
        _mousemove: null,
        _mouseup: null
      }
    };
  }

  onMouseDown(e)
  {
    const target = ReactDOM.findDOMNode(this);
    const offset = Draggable.getMousePosition(e);
    const transform = Draggable.getElementTransform(target);
    offset.x -= transform.matrix.e;
    offset.y -= transform.matrix.f;

    const mousemove = this.onMouseMove.bind(this);
    const mouseup = this.onMouseUp.bind(this);

    this.setState({
      drag: {
        offset: offset,
        transform: transform,
        _mousemove: mousemove,
        _mouseup: mouseup
      }
    });

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove(e)
  {
    const coord = Draggable.getMousePosition(e);
    this.state.drag.transform.setTranslate(
      coord.x - this.state.drag.offset.x,
      coord.y - this.state.drag.offset.y);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp(e)
  {
    document.removeEventListener('mousemove', this.state.drag._mousemove);
    document.removeEventListener('mouseup', this.state.drag._mouseup);
    e.stopPropagation();
    e.preventDefault();
  }

  render()
  {
    return this.transferPropsTo(React.DOM.g({
      onMouseDown: this.onMouseDown.bind(this),
      style: {
        pointerEvents: "bounding-box"
      }
    }, this.props.children));
  }

  static getElementTransform(el)
  {
    const svg = document.getElementById('workspace-content');
    const transforms = el.transform.baseVal;

    if (transforms.length === 0 ||
      transforms.getItem(0).type != SVGTransform.SVG_TRANSFORM_TRANSLATE)
    {
      const translate = svg.createSVGTransform();
      translate.setTranslate(0, 0);

      el.transform.baseVal.insertItemBefore(translate, 0);
    }

    return transforms.getItem(0);
  }

  static getMousePosition(ev)
  {
    const svg = document.getElementById('workspace-content');
    const ctm = svg.getScreenCTM();
    return {
      x: (ev.clientX - ctm.e) / ctm.a,
      y: (ev.clientY - ctm.f) / ctm.d
    };
  }
}

export default Draggable;
