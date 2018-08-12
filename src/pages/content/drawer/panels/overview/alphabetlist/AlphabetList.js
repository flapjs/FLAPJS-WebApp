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

    this.state = {
      editing: false
    };

    this.editSymbolTag = React.createRef();

    this.onCreate = this.onCreate.bind(this);
    this.disableEdit = this.disableEdit.bind(this);
  }

  onCreate(e) {
    this.setState({editing: true}, () => {
      this.editSymbolTag.ref.focus();
    });
  }

  disableEdit() {
    this.setState({editing: false});
  }

  render()
  {
    const alphabet = this.props.machine.getAlphabet().sort();
    return <InfoBlock title="Alphabet">
      <div className="alphalist-container">
        <div className="alphalist">
          {
            alphabet.map((e, i) => {
              return <AlphabetTag key={i} src={e} list={this} machine={this.props.machine} alphabet={alphabet}/>
            })
          }
          <AlphabetTag key={-1} ref={ref=>this.editSymbolTag=ref} src={""} list={this} machine={this.props.machine}
                       alphabet={alphabet} style={{
            display: this.state.editing ? "block" : "none"
          }}/>
        </div>
        <IconButton onClick={this.onCreate}>
          <BoxAddIcon/>
        </IconButton>
      </div>
    </InfoBlock>;
  }
}

export default AlphabetList;
