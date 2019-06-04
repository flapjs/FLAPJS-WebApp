import React from 'react';

import NodeRenderer from 'graph2/renderer/NodeRenderer.js';

class GraphNodeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const fill = this.props.fill;
        const stroke = this.props.stroke;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        const label = node.getNodeLabel();
        const radius = node.getNodeSize();

        return (
            <React.Fragment>
                <NodeRenderer
                    position={node} 
                    radius={radius}
                    label={label}
                    color={fill}
                    outline={stroke}
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

export default GraphNodeRenderer;
