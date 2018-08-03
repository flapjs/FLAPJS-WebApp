import React from 'react';
import './StateList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import CreateIcon from '../icon/CreateIcon.js';
import StartIcon from './StartIcon.js';

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
    const nodes = this.props.machine.graph.nodes;
    return <InfoBlock title="States">
      <div className="statelist-container">
        <div className="statelist">
          <StartIcon />
          {
            nodes.map((e, i) => {
              return <StateTag key={i} src={e}/>
            })
          }
        </div>
        <CreateIcon onClick={this.onCreate}/>
      </div>
    </InfoBlock>;
  }
}

export default StateList;
