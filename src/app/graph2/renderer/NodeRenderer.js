import React from 'react';

const INPUT_MASK_NODE_RADIUS_OFFSET = 4;

export const EVENT_SOURCE_NODE = 'node';

export const DefaultNodeShapeRenderer = props => (
    <React.Fragment>
        <circle cx={props.position.x} cy={props.position.y}
            r={props.radius}
            fill={props.color}
            stroke={props.outline} />
        {(props.onMouseOver || props.onMouseOut) &&
            <circle cx={props.position.x} cy={props.position.y}
                r={props.radius + INPUT_MASK_NODE_RADIUS_OFFSET}
                fill="transparent"
                cursor="pointer"
                onMouseOver={props.onMouseOver}
                onMouseOut={props.onMouseOut}
                pointerEvents={props.pointerEvents} />}
    </React.Fragment>
);

export const DefaultLabelRenderer = props => (
    <text x={props.position.x} y={props.position.y + 4}
        pointerEvents="none"
        style={{
            userSelect: 'none',
            fontSize: `${(1 - Math.min(Math.max(props.label.length - 2, 0) / 6, 0.5))}em`
        }}
        textAnchor="middle"
        fill={props.color}>
        {props.label}
    </text>
);

class NodeRenderer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const position = this.props.position;
        const radius = this.props.radius || 16;
        const label = this.props.label || '';
        const color = this.props.color || '#FFFFFF';
        const outline = this.props.outline || '#000000';
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents || 'visiblePainted';

        const NodeShapeRenderer = DefaultNodeShapeRenderer;
        const NodeLabelRenderer = DefaultLabelRenderer;

        return (
            <g>
                {NodeShapeRenderer &&
                    <NodeShapeRenderer
                        position={position}
                        radius={radius}
                        color={color}
                        outline={outline}
                        onMouseOver={onMouseOver ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_NODE;
                            onMouseOver(e);
                        } : null}
                        onMouseOut={onMouseOut ? e =>
                        {
                            const value = e.target['value'] || (e.target['value'] = {});
                            value.type = EVENT_SOURCE_NODE;
                            onMouseOut(e);
                        } : null}
                        pointerEvents={pointerEvents} />}
                {NodeLabelRenderer &&
                    <NodeLabelRenderer
                        position={position}
                        label={label}
                        color={outline} />}
            </g>
        );
    }
}

export default NodeRenderer;
