import React from 'react';

class GraphNode extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      accept: false,
      label: "q0",
      cursor: {
        move: false,
        offset: {x: 0, y: 0},
        _mousemove: null,
        _mouseup: null,
        _edge: null
      },
      proxyEdge: null
    };
  }

  onContextMenu(e)
  {
    const offset = getMousePosition(e);
    offset.x -= this.state.x;
    offset.y -= this.state.y;

    //If the previous move was interrupted, make sure to disconnect it.
    if (this.state.cursor._mousemove)
    {
      document.removeEventListener('mousemove', this.state.cursor._mousemove);
    }
    if (this.state.cursor._mouseup)
    {
      document.removeEventListener('mouseup', this.state.cursor._mouseup);
    }

    const mousemove = this.onMouseMove.bind(this);
    const mouseup = this.onMouseUp.bind(this);

    this.setState({
      cursor: {
        offset: offset,
        move: true,
        _mousemove: mousemove,
        _mouseup: mouseup
      }
    });

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseDown(e)
  {
    //Left click only
    if (e.button != 0) return;

    //If the previous move was interrupted, make sure to disconnect it.
    if (this.state.cursor._mousemove)
    {
      document.removeEventListener('mousemove', this.state.cursor._mousemove);
    }
    if (this.state.cursor._mouseup)
    {
      document.removeEventListener('mouseup', this.state.cursor._mouseup);
    }

    const mousemove = this.onMouseMove.bind(this);
    const mouseup = this.onMouseUp.bind(this);

    this.setState((prev, props) => {
      return {
        cursor: {
          offset: prev.cursor.offset,
          move: false,
          _mousemove: mousemove,
          _mouseup: mouseup
        }
      };
    });

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove(e)
  {
    const coord = getMousePosition(e);
    const x = coord.x - this.state.cursor.offset.x;
    const y = coord.y - this.state.cursor.offset.y;
    if (this.state.cursor.move)
    {
      this.setState({x: x, y: y});
    }
    else if (!this.state.proxyEdge)
    {
      //Check if out of border...if so, start creating edges...
      if (x * x + y *  y > this.props.radius * this.props.radius)
      {
        this.setState({proxyEdge: true});
      }
    }
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp(e)
  {
    //Finish creating the edge...
    if (this.state.proxyEdge)
    {
    }
    //Do this only if not creating an edge... nor moving...
    else if (!this.state.cursor.move)
    {
      this.setState((prev, props) => {
        return {
          accept: !prev.accept
        };
      });
    }

    //Clean up
    if (this.state.cursor._mousemove)
    {
      document.removeEventListener('mousemove', this.state.cursor._mousemove);
    }
    if (this.state.cursor._mouseup)
    {
      document.removeEventListener('mouseup', this.state.cursor._mouseup);
    }

    //Restore to default state
    this.setState((prev, props) => {
        return {
          cursor: {
            offset: prev.cursor.offset,
            move: false,
            _mousemove: null,
            _mouseup: null
          },
          proxyEdge: null
        };
    });
    e.stopPropagation();
    e.preventDefault();
  }

  render()
  {
    const x = this.state.x;
    const y = this.state.y;
    const accept = this.state.accept;
    const label = this.state.label;

    const radius = this.props.radius;// * (this.state.cursor.move ? 1.3 : 1.0);
    const innerRadius = (radius * 3.0) / 4.0;

    return <g className="graph-node"
      style={{pointerEvents: "bounding-box"}}
      onMouseDown={this.onMouseDown.bind(this)}
      onContextMenu={this.onContextMenu.bind(this)}>

      //Outer circle
      <circle
        cx={x}
        cy={y}
        r={radius}/>

      //Inner circle
      {accept &&
        <circle
          cx={x}
          cy={y}
          r={innerRadius}
          fill="none"/>}

      //Label
      <text
        x={x}
        y={y}
        dy="0.3em"
        textAnchor="middle">
        {label}
      </text>
    </g>;
  }
}

function getMousePosition(ev)
{
  const svg = document.getElementById('workspace-content');
  const ctm = svg.getScreenCTM();
  return {
    x: (ev.clientX - ctm.e) / ctm.a,
    y: (ev.clientY - ctm.f) / ctm.d
  };
}

export default GraphNode;
