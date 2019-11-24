/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: THE ABOVE should DEFINITELY BE REMOVED!!!

import React from 'react';
import PropTypes from 'prop-types';

const QUAD_RADIAN_THRESHOLD = 0.01;
const QUAD_REVERSE_OFFSET_THRESHOLD = 4;
const ARROW_WIDTH = 10;
const SIXTH_PI = Math.PI / 6;
const HALF_PI = Math.PI / 4;
const INPUT_MASK_EDGE_WIDTH = 8;

export const DIRECTED_FORWARD = 'forward';
export const DIRECTED_BACKWARD = 'backward';
export const DIRECTED_BOTH = 'both';
export const DIRECTED_NONE = 'undirected';

export const EVENT_SOURCE_FORWARD_ENDPOINT = 'forward-endpoint';
export const EVENT_SOURCE_BACKWARD_ENDPOINT = 'backward-endpoint';
export const EVENT_SOURCE_EDGE = 'edge';
export const EVENT_SOURCE_LABEL = 'label';

export const DefaultEndpointRenderer = props => (
    <React.Fragment>
        <path
            d={'M ' +
                (props.position.x - (props.length * Math.sin(props.angle - SIXTH_PI))) +
                ' ' +
                (props.position.y - (props.length * Math.cos(props.angle - SIXTH_PI))) +
                ' ' +
                'L ' + props.position.x + ' ' + props.position.y +
                ' ' +
                'L ' +
                (props.position.x - (props.length * Math.sin(props.angle + SIXTH_PI))) +
                ' ' +
                (props.position.y - (props.length * Math.cos(props.angle + SIXTH_PI)))}
            stroke={props.color}
            fill="none" />
        <circle
            cx={props.position.x - (props.length * Math.cos(-props.angle + HALF_PI))} cy={props.position.y - (props.length * Math.sin(-props.angle + HALF_PI))}
            r={props.length}
            fill="transparent"
            cursor="pointer"
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            pointerEvents={props.pointerEvents} />
    </React.Fragment>
);
DefaultEndpointRenderer.propTypes = {
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    length: PropTypes.number,
    angle: PropTypes.number,
    color: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

export const DefaultLabelRenderer = props => (
    <g transform={'translate(' + props.position.x + ',' + props.position.y + ')' +
        ' ' +
        'rotate(' + (props.direction * 180 / Math.PI) + ')'}>
        {
            props.labels && props.labels.length > 0 &&
            props.labels.map((str, i) =>
            {
                const onMouseOver = props.onMouseOver;
                const onMouseOut = props.onMouseOut;
                return (
                    <text key={str + '.' + i}
                        transform={'translate(0,' + ((i + 1) * -15) + ')' +
                            (props.reverse ? ' scale(-1,-1)' : '')}
                        alignmentBaseline="central"
                        style={{ userSelect: 'none' }}
                        textAnchor="middle"
                        fill={props.color}
                        cursor="pointer"
                        onMouseOver={onMouseOver ? e => 
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.index = i;
                            onMouseOver(e);
                        } : null}
                        onMouseOut={onMouseOut ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.index = i;
                            onMouseOut(e);
                        } : null}
                        pointerEvents={props.pointerEvents}>
                        {str}
                    </text>
                );
            })
        }
    </g>
);
DefaultLabelRenderer.propTypes = {
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    direction: PropTypes.number,
    labels: PropTypes.arrayOf(PropTypes.string),
    reverse: PropTypes.bool,
    color: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

class EdgeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const directed = this.props.directed || DIRECTED_NONE;

        const ForwardEndpointRenderer =
            (directed === DIRECTED_FORWARD || directed === DIRECTED_BOTH) ?
                (this.props.forwardEndpointRenderer ||
                    this.props.endpointRenderer ||
                    DefaultEndpointRenderer) : null;
        const BackwardEndpointRenderer =
            (directed === DIRECTED_BACKWARD || directed === DIRECTED_BOTH) ?
                (this.props.backwardEndpointRenderer ||
                    this.props.endpointRenderer ||
                    DefaultEndpointRenderer) : null;
        const EdgeLabelRenderer = this.props.labelRenderer || DefaultLabelRenderer;

        const fromPoint = this.props.from;
        const toPoint = this.props.to;
        const centerPoint = this.props.center;
        const label = this.props.label || '';
        const direction = this.props.direction || 0;
        const color = this.props.color || '#000000';
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents || 'visiblePainted';

        let reverseLabel = false;
        let fromAngle;
        let toAngle;
        let quadLine = null;

        const dftx = fromPoint.x - toPoint.x;
        const dfty = fromPoint.y - toPoint.y;
        const dfcx = fromPoint.x - centerPoint.x;
        const dfcy = fromPoint.y - centerPoint.y;
        const ftrad = Math.atan2(dfty, dftx);
        const fcrad = Math.atan2(dfcy, dfcx);
        if (Math.abs(ftrad - fcrad) <= QUAD_RADIAN_THRESHOLD)
        {
            toAngle = Math.atan2(centerPoint.x - toPoint.x, centerPoint.y - toPoint.y) + Math.PI;
            fromAngle = Math.atan2(centerPoint.x - fromPoint.x, centerPoint.y - fromPoint.y) + Math.PI;
            quadLine = 'L ' + toPoint.x + ' ' + toPoint.y;
            reverseLabel = false;
        }
        else
        {
            const cx = ((centerPoint.x * 4) - fromPoint.x - toPoint.x) / 2;
            const cy = ((centerPoint.y * 4) - fromPoint.y - toPoint.y) / 2;
            toAngle = Math.atan2(cx - toPoint.x, cy - toPoint.y) + Math.PI;
            fromAngle = Math.atan2(cx - fromPoint.x, cy - fromPoint.y) + Math.PI;
            quadLine = 'Q ' + cx + ' ' + cy + ' ' + toPoint.x + ' ' + toPoint.y;
            reverseLabel = cy > centerPoint.y + QUAD_REVERSE_OFFSET_THRESHOLD;
        }

        const pathData = `M ${fromPoint.x} ${fromPoint.y} ${quadLine}`;
        return (
            <g>
                <path d={pathData}
                    stroke={color}
                    fill="none" />
                <path d={pathData}
                    stroke="transparent"
                    strokeWidth={`${INPUT_MASK_EDGE_WIDTH}px`}
                    fill="none"
                    cursor="pointer"
                    onMouseOver={onMouseOver ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.type = EVENT_SOURCE_EDGE;
                        onMouseOver(e);
                    } : null}
                    onMouseOut={onMouseOut ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.type = EVENT_SOURCE_EDGE;
                        onMouseOut(e);
                    } : null}
                    pointerEvents={pointerEvents} />
                {ForwardEndpointRenderer &&
                    <ForwardEndpointRenderer
                        position={toPoint}
                        angle={toAngle}
                        length={ARROW_WIDTH}
                        color={color}
                        onMouseOver={onMouseOver ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_FORWARD_ENDPOINT;
                            onMouseOver(e);
                        } : null}
                        onMouseOut={onMouseOut ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_FORWARD_ENDPOINT;
                            onMouseOut(e);
                        } : null}
                        pointerEvents={pointerEvents} />}
                {BackwardEndpointRenderer &&
                    <BackwardEndpointRenderer
                        position={fromPoint}
                        angle={fromAngle}
                        length={ARROW_WIDTH}
                        color={color}
                        onMouseOver={onMouseOver ? e => 
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_BACKWARD_ENDPOINT;
                            onMouseOver(e);
                        } : null}
                        onMouseOut={onMouseOut ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_BACKWARD_ENDPOINT;
                            onMouseOut(e);
                        } : null}
                        pointerEvents={pointerEvents} />}
                {EdgeLabelRenderer &&
                    <EdgeLabelRenderer
                        position={centerPoint}
                        labels={label.split('\n')}
                        direction={direction}
                        reverse={reverseLabel}
                        color={color}
                        onMouseOver={onMouseOver ? e => 
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_LABEL;
                            onMouseOver(e);
                        } : null}
                        onMouseOut={onMouseOut ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_LABEL;
                            onMouseOut(e);
                        } : null}
                        pointerEvents={pointerEvents} />}
            </g>
        );
    }
}
EdgeRenderer.propTypes = {
    directed: PropTypes.string,
    forwardEndpointRenderer: PropTypes.func,
    endpointRenderer: PropTypes.func,
    backwardEndpointRenderer: PropTypes.func,
    labelRenderer: PropTypes.func,
    from: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    to: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    center: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    label: PropTypes.string,
    direction: PropTypes.number,
    color: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

export default EdgeRenderer;
