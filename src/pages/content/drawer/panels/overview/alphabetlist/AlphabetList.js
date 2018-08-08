import React from 'react';
import './AlphabetList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import IconButton from 'icons/IconButton.js';
import BoxAddIcon from 'icons/BoxAddIcon.js';

import AlphabetTag from './AlphabetTag.js';

class AlphabetList extends React.Component
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
    const alphabet = this.props.machine.getAlphabet().sort();
    return <InfoBlock title="Alphabet">
      <div className="alphalist-container">
        <div className="alphalist">
        {
          alphabet.map((e, i) => {
            return <AlphabetTag key={i} src={e}/>
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

export default AlphabetList;
