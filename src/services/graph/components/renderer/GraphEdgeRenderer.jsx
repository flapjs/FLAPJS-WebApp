/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: THE ABOVE should DEFINITELY BE REMOVED!!!

import React from 'react';
import PropTypes from 'prop-types';

import EdgeRenderer, {DIRECTED_FORWARD} from './EdgeRenderer.jsx';

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
GraphEdgeRenderer.propTypes = {
    // TODO: Fix type
    edge: PropTypes.any,
    stroke: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

export default GraphEdgeRenderer;
