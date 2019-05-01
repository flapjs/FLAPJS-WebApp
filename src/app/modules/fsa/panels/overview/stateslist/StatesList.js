import React from 'react';
import './StatesList.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import IconButton from 'deprecated/icons/IconButton.js';
import BoxAddIcon from 'deprecated/icons/BoxAddIcon.js';
import TriangleIcon from 'deprecated/icons/TriangleIcon.js';

import StateTag from './StateTag.js';

class StatesList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onStateCreate = this.onStateCreate.bind(this);
    }

    onStateCreate(e)
    {
        const x = -100 + (Math.random() * 100 * 2);
        const y = -100 + (Math.random() * 100 * 2);
        this.props.graphController.createNode(x, y);
    }

    render()
    {
        const graphController = this.props.graphController;
        const graph = graphController.getGraph();
        return <InfoBlock title={I18N.toString('component.stateslist.title')} defaultValue="true">
            <div className="statelist-container">
                <div className="statelist">
                    <TriangleIcon/>
                    {
                        graph.getNodes().map((e, i) => 
                        {
                            return <StateTag key={e.getGraphElementID()} src={e} label={e.getNodeLabel()} accept={e.getNodeAccept()}
                                graphController={graphController}
                                onFocus={ev => graphController.focusOnNode(e)}/>;
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

export default StatesList;
