import React from 'react';

import InitialMarkerRenderer from './InitialMarkerRenderer.js';

class FSAInitialMarkerRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const color = this.props.color;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        return (
            <React.Fragment>
                <InitialMarkerRenderer
                    position={node}
                    offset={node.getNodeSize()}
                    size={node.getNodeSize() / 2}
                    color={color}
                    onMouseOver={onMouseOver ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = node;
                        onMouseOver(e);
                    } : null}
                    onMouseOut={onMouseOut ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = node;
                        onMouseOut(e);
                    } : null}
                    pointerEvents={pointerEvents} />
            </React.Fragment>
        );
    }
}

export default FSAInitialMarkerRenderer;
