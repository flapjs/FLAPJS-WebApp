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

    this.onStateCreate = this.onStateCreate.bind(this);
  }

  onStateCreate(e)
  {
    const machineBuilder = this.props.machineBuilder;
    const graph = machineBuilder.graph;
    const x = -100 + (Math.random() * 100 * 2);
    const y = -100 + (Math.random() * 100 * 2);
    graph.newNode(x, y, machineBuilder.getLabeler().getNextDefaultNodeLabel());
  }

  render()
  {
    const pointer = this.props.controller.pointer;
    const graph = this.props.machineBuilder.graph;
    return <InfoBlock title="States" defaultValue="true">
      <div className="statelist-container">
        <div className="statelist">
          <TriangleIcon/>
          {
            graph.nodes.map((e, i) => {
              return <StateTag key={e.label} src={e} label={e.label} accept={e.accept} graph={graph}
                onFocus={(ev) => {
                  //Center workspace at focused node; inverted due to graph-to-screen space
                  pointer.setOffset(-e.x, -e.y);
                }}/>
            })
          }
        </div>
        <IconButton onClick={this.onStateCreate}>
          <BoxAddIcon/>
        </IconButton>
      </div>
    </InfoBlock>;
  }
}

export default StateList;
