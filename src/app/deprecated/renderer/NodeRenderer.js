import React from 'react';

export const DefaultNodeShapeRenderer = props => (
    <React.Fragment>
        <circle cx={props.position.x} cy={props.position.y}
            r={props.radius}
            fill={props.color}
            stroke={props.outline} />
    </React.Fragment>
);

export const DefaultLabelRenderer = props => (
    <text x={props.position.x} y={props.position.y + 4}
        pointerEvents="none"
        style={{
            userSelect: 'none',
            fontSize: (1 - Math.min(Math.max(props.label.length - 2, 0) / 6, 0.5)) + 'em'
        }}
        textAnchor="middle"
        stroke={props.color}>
        {props.label}
    </text>
);

class NodeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const position = this.props.position;
        const radius = this.props.radius || 16;
        const label = this.props.label || '';
        const color = this.props.color || '#FFFFFF';
        const outline = this.props.outline || '#000000';

        const NodeShapeRenderer = DefaultNodeShapeRenderer;
        const NodeLabelRenderer = DefaultLabelRenderer;
        return (
            <g>
                {NodeShapeRenderer &&
                    <NodeShapeRenderer position={position} radius={radius} color={color} outline={outline} />}
                {NodeLabelRenderer &&
                    <NodeLabelRenderer position={position} label={label} color={outline} />}
            </g>
        );
    }
}

export default NodeRenderer;
