import React from 'react';

import GraphPlaygroundLayer from '@flapjs/components/graph/GraphPlaygroundLayer.jsx';
import NodeGraphLayer from './NodeGraphLayer.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class BasePlaygroundLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        return (
            <GraphPlaygroundLayer
                renderGraph={graphView =>
                    <SessionStateConsumer>
                        {
                            session =>
                                <NodeGraphLayer
                                    inputContext={graphView.getInputContext()}
                                    graphController={session.graphController}
                                    inputController={session.inputController}
                                    editable={true}/>
                        }
                    </SessionStateConsumer>
                }/>
        );
    }
}

export default BasePlaygroundLayer;

