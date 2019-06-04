import React from 'react';
import './AlphabetList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import IconButton from 'deprecated/icons/IconButton.js';
import BoxAddIcon from 'deprecated/icons/BoxAddIcon.js';

import AlphabetTag from './AlphabetTag.js';

class AlphabetList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.editingTag = null;

        this.state = {
            editing: false
        };

        this.onSymbolCreate = this.onSymbolCreate.bind(this);
        this.onStopEditing = this.onStopEditing.bind(this);
    }

    onSymbolCreate(e)
    {
        this.setState({editing: true}, () => 
        {
            this.editingTag.ref.focus();
        });
    }

    onStopEditing(e)
    {
        this.setState({editing: false});
    }

    render()
    {
        const machineController = this.props.machineController;
        const alphabet = machineController.getAlphabet();

        return <InfoBlock title={I18N.toString('component.alphabetlist.title')}>
            <div className="alphalist-container">
                <div className="alphalist">
                    {
                        alphabet.map((e, i) => 
                        {
                            return <AlphabetTag key={e + '.' + i} src={e} machineController={machineController}/>;
                        })
                    }
                    {
                        this.state.editing &&
            <AlphabetTag ref={ref=>this.editingTag=ref} src={''} machineController={machineController}
                onBlur={this.onStopEditing}/>
                    }
                </div>

                <IconButton onClick={this.onSymbolCreate}>
                    <BoxAddIcon/>
                </IconButton>
            </div>
        </InfoBlock>;
    }
}

export default AlphabetList;
