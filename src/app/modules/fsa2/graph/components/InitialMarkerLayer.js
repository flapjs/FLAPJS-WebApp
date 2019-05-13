import React from 'react';

import FSAInitialMarkerRenderer from '../renderer/FSAInitialMarkerRenderer';

class InitialMarkerLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;

        const node = this.props.node;
        
        return (
            <React.Fragment>
                {node &&
                    <FSAInitialMarkerRenderer
                        node={node}
                        color={'var(--color-graph-text)'}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        pointerEvents={inputController.hasPointerEvents(node) ? 'all' : 'none'} />}
            </React.Fragment>
        );
    }
}

export default InitialMarkerLayer;