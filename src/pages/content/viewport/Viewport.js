import React from 'react';

import './Viewport.css';

import LabelEditor from './LabelEditor.js';
import TrashCan from './TrashCan.js';

class Viewport extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();
    this.labelEditor = React.createRef();

    this.state = {
      mode: Viewport.NORMAL
    };
  }

  onFileDrop(ev)
  {
    //Prevent file from being opened
    ev.preventDefault();

    if (ev.dataTransfer.items)
    {
      const length = ev.dataTransfer.items.length;
      for(let i = 0; i < length; ++i)
      {
        let file = ev.dataTransfer.items[i];
        if (file.kind === 'file')
        {
          alert(file.name);
        }
      }
    }
    else
    {
      const length = ev.dataTransfer.files.length;
      for(let i = 0; i < length; ++i)
      {
        let file = ev.dataTransfer.files[i];
        alert(file.name);
      }
    }

    if (ev.dataTransfer.items)
    {
      ev.dataTransfer.items.clear();
    }
    else
    {
      ev.dataTransfer.clearData();
    }
  }

  render()
  {
    return <div className="viewport-container" ref={ref=>this.ref=ref}
      style={{outlineColor: getModeColor(this.state.mode)}}>
      <LabelEditor screen={this.props.app.workspace.ref} ref={ref=>this.labelEditor=ref}/>
      <TrashCan controller={this.props.controller} viewport={this}/>
    </div>;
  }
}
Viewport.NORMAL = 0;
Viewport.WAITING = 1;
Viewport.DANGEROUS = 2;

function getModeColor(mode)
{
  switch(mode)
  {
    case Viewport.WAITING:
      return "rgba(0,0,0,0.1)";
    case Viewport.DANGEROUS:
      return "#E35B5B";
    case Viewport.NORMAL:
    default:
      return "rgba(0,0,0,0.02)";
  }
}

export default Viewport;
