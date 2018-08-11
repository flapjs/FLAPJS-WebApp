import React from 'react';
import './TransitionTable.css';

import InfoBlock from '../infoblock/InfoBlock.js';

class TransitionTable extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <InfoBlock title="Transition Table">
      <div className="transitiontable-container">
        <div className="transitiontable">
          Some Transitions...
        </div>
      </div>
    </InfoBlock>;
  }
}

export default TransitionTable;
