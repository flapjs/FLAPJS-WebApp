/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import EdgeRenderer, { DIRECTED_FORWARD } from '@flapjs/systems/graph/components/renderer/EdgeRenderer.jsx';

import { LINE_SEPARATOR } from '../element/PDAEdge.js';

class PDAEdgeRenderer extends React.Component
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
            <>
            <EdgeRenderer
                directed={DIRECTED_FORWARD}
                from={start}
                to={end}
                center={center}
                label={label.split(LINE_SEPARATOR).join('\n')}
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
            </>
        );
    }
}

// TODO: This is not properly set.
PDAEdgeRenderer.propTypes = {
    edge: PropTypes.any,
    stroke: PropTypes.any,
    onMouseOver: PropTypes.any,
    onMouseOut: PropTypes.any,
    pointerEvents: PropTypes.any,
};

export default PDAEdgeRenderer;
