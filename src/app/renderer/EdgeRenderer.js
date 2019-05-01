import React from 'react';

const QUAD_RADIAN_THRESHOLD = 0.01;
const QUAD_REVERSE_OFFSET_THRESHOLD = 4;
const ARROW_WIDTH = 10;
const SIXTH_PI = Math.PI / 6;

export const DIRECTED_FORWARD = 'forward';
export const DIRECTED_BACKWARD = 'backward';
export const DIRECTED_BOTH = 'both';
export const DIRECTED_NONE = 'undirected';

export const DefaultEndpointRenderer = props => (
    <React.Fragment>
        <path d={
            'M ' +
            (props.position.x - (props.length * Math.sin(props.angle - SIXTH_PI))) +
            ' ' +
            (props.position.y - (props.length * Math.cos(props.angle - SIXTH_PI))) +
            ' ' +
            'L ' + props.position.x + ' ' + props.position.y +
            ' ' +
            'L ' +
            (props.position.x - (props.length * Math.sin(props.angle + SIXTH_PI))) +
            ' ' +
            (props.position.y - (props.length * Math.cos(props.angle + SIXTH_PI)))
        }
        stroke={props.color}
        fill="none" />
    </React.Fragment>
);

export const DefaultLabelRenderer = props => (
    <g transform={'translate(' + props.position.x + ',' + props.position.y + ')' +
        ' ' +
        'rotate(' + (props.direction * 180 / Math.PI) + ')'}>
        {
            props.labels && props.labels.length > 0 &&
            props.labels.map((str, i) => 
            {
                return (
                    <text key={str + '.' + i}
                        transform={'translate(0,' + ((i + 1) * -15) + ')' +
                            (props.reverse ? ' scale(-1,-1)' : '')}
                        alignmentBaseline="central"
                        pointerEvents="none"
                        style={{ userSelect: 'none' }}
                        textAnchor="middle"
                        fill={props.color}>
                        {str}
                    </text>
                );
            })
        }
    </g>
);

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

        return (
            <g>
                <path d={'M ' + fromPoint.x + ' ' + fromPoint.y + ' ' + quadLine}
                    stroke={color}
                    fill="none" />
                {ForwardEndpointRenderer &&
                    <ForwardEndpointRenderer position={toPoint} angle={toAngle} length={ARROW_WIDTH} color={color} />}
                {BackwardEndpointRenderer &&
                    <BackwardEndpointRenderer position={fromPoint} angle={fromAngle} length={ARROW_WIDTH} color={color} />}
                {EdgeLabelRenderer &&
                    <EdgeLabelRenderer position={centerPoint} labels={label.split('\n')} direction={direction} reverse={reverseLabel} color={color} />}
            </g>
        );
    }
}

export default EdgeRenderer;
