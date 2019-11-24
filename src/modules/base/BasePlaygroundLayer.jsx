import React from 'react';

import GraphService from '@flapjs/services/GraphService.js';
import GraphPlaygroundLayer from '@flapjs/components/graph/GraphPlaygroundLayer.jsx';
import NodeGraphLayer from './NodeGraphLayer.jsx';

class BasePlaygroundLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        return (
            <GraphService.CONTEXT.StateConsumer>
                {
                    service =>
                        <GraphPlaygroundLayer
                            renderGraph={graphView =>
                                <NodeGraphLayer
                                    inputContext={graphView.getInputContext()}
                                    inputController={service.inputController}
                                    graphController={service.graphController}
                                    editable={true}/>
                            }/>
                }
            </GraphService.CONTEXT.StateConsumer>
        );
    }
}

export default BasePlaygroundLayer;

