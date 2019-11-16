import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';
import GraphPlaygroundLayer from '@flapjs/components/graph/GraphPlaygroundLayer.jsx';
import PDAGraphLayer from './PDAGraphLayer.jsx';

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
            <SessionStateConsumer>
                {
                    session =>
                        <GraphPlaygroundLayer
                            session={session}
                            renderGraph={graphView =>
                                <PDAGraphLayer
                                    inputContext={graphView.getInputContext()}
                                    inputController={session.inputController}
                                    graphController={session.graphController}
                                    editable={true}/>
                            }/>
                }
            </SessionStateConsumer>
        );
    }
}

export default FSAPlaygroundLayer;

