import React from 'react';

import CreateIcon from './CreateIcon.js';
import CollapseIcon from './CollapseIcon.js';
import StartIcon from './StartIcon.js';
import StateTag from './StateTag.js';

import './StateList.css';

class StateList extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isCollapsed: false
    };
  }

  render()
  {
    const nodes = this.props.machine.graph.nodes;
    return <div className="statelist-container">
      <div className="statelist-header">
        <label>States</label>
        <CollapseIcon more={this.state.isCollapsed}/>
      </div>
      <div className="statelist-content">
        <StartIcon />
        {
          nodes.map((e, i) => {
            return <StateTag key={i} src={e}/>
          })
        }
      </div>
      <CreateIcon />
    </div>
  }
}

export default StateList;
