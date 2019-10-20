import React from 'react';

import GraphView from '@flapjs/deprecated/graph/components/GraphView.jsx';

import NodeGraphLayer from './NodeGraphLayer.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class BasePlaygroundLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this._graphAnimationFrame = this.update.bind(this);
        this._graphRequestAnimationFrame = null;
    }

    /** @override */
    componentDidMount()
    {
        this._graphRequestAnimationFrame = requestAnimationFrame(this._graphAnimationFrame);
    }

    /** @override */
    componentWillUnmount()
    {
        cancelAnimationFrame(this._graphRequestAnimationFrame);
    }

    update()
    {
        // HACK: This will re-render the graph at 60fps REGARDLESS if it has updated.
        this._graphRequestAnimationFrame = requestAnimationFrame(this._graphAnimationFrame);
        this.forceUpdate();
    }

    /** @override */
    render()
    {
        return (
            <SessionStateConsumer>
                {
                    state =>
                        <GraphView
                            inputController={state.inputController}
                            viewController={state.viewController}
                            renderGraph={graphView => 
                                <NodeGraphLayer
                                    inputContext={graphView.getInputContext()}
                                    inputController={state.inputController}
                                    graphController={state.graphController}
                                    editable={true}/>}
                            renderOverlay={graphView => {}}>
                        </GraphView>
                }
            </SessionStateConsumer>
        );
    }
}

export default BasePlaygroundLayer;

