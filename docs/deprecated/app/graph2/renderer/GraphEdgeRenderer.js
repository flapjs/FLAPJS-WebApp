import React from 'react';

import EdgeRenderer, {DIRECTED_FORWARD} from 'graph2/renderer/EdgeRenderer.js';

class GraphEdgeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const edge = this.props.edge;
        const stroke = this.props.stroke;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        const start = edge.getStartPoint();
        const end = edge.getEndPoint();
        const center = edge.getCenterPoint();
        const label = edge.getEdgeLabel();
        const edgeDir = edge.getEdgeDirection();

        return (
            <React.Fragment>
                <EdgeRenderer
                    directed={DIRECTED_FORWARD}
                    from={start}
                    to={end}
                    center={center}
                    label={label}
                    direction={edgeDir}
                    color={stroke}
                    onMouseOver={onMouseOver ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = edge;
                        onMouseOver(e);
                    } : null}
                    onMouseOut={onMouseOut ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = edge;
                        onMouseOut(e);
                    } : null}
                    pointerEvents={pointerEvents} />
            </React.Fragment>
        );
    }
}

export default GraphEdgeRenderer;
