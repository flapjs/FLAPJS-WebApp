import React from 'react';

import GraphService from '@flapjs/services/GraphService.js';
import GraphPlaygroundLayer from '@flapjs/components/graph/GraphPlaygroundLayer.jsx';
import FSAGraphLayer from './FSAGraphLayer.jsx';

class FSAPlaygroundLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <GraphService.CONTEXT.StateConsumer>
                {
                    graphService =>
                        <GraphPlaygroundLayer
                            renderGraph={graphView =>
                                <FSAGraphLayer
                                    inputContext={graphView.getInputContext()}
                                    inputController={graphService.inputController}
                                    graphController={graphService.graphController}
                                    editable={true}/>
                            }/>
                }
            </GraphService.CONTEXT.StateConsumer>
        );
    }
}

export default FSAPlaygroundLayer;

