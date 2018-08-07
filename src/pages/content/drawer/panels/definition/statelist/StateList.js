import React from 'react';
import './StateList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import IconButton from 'icons/IconButton.js';
import BoxAddIcon from 'icons/BoxAddIcon.js';
import TriangleIcon from 'icons/TriangleIcon.js';

import StateTag from './StateTag.js';

class StateList extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onCreate = this.onCreate.bind(this);
  }

  onCreate(e)
  {

  }

  render()
  {
    const graph = this.props.machine.graph;
    const nodes = this.props.machine.graph.nodes;
    return <InfoBlock title="States">
      <div className="statelist-container">
        <div className="statelist">
          <TriangleIcon/>
          {
            nodes.map((e, i) => {
              return <StateTag key={i} src={e} onRemove={e=>graph.deleteNode(e)} onRename={(e,id)=>e.setCustomLabel(id)}/>
            })
          }
        </div>
        <IconButton onClick={this.onCreate}>
          <BoxAddIcon/>
        </IconButton>
      </div>
    </InfoBlock>;
  }
}

export default StateList;
