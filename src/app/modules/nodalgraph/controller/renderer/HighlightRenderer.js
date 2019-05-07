import React from 'react';

const CURSOR_RADIUS = 4;
const NODE_RADIUS = 16;
const EDGE_RADIUS = 12;
const ENDPOINT_RADIUS = 6;
const INITIAL_MARKER_OFFSET_X = -(NODE_RADIUS + (NODE_RADIUS / 2));

const HIGHLIGHT_RADIUS_OFFSET = 4;
const HIGHLIGHT_LINE_WIDTH = 3;
const HIGHLIGHT_LINE_ARRAY = [8, 6];

class HighlightRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const target = this.props.target;
        const type = this.props.type;

        let x = 0;
        let y = 0;
        let r = CURSOR_RADIUS;
        switch(type)
        {
        case 'node':
            x = target.x || 0;
            y = target.y || 0;
            r = NODE_RADIUS;
            break;
        case 'edge':
            const center = target.getCenterPoint();
            x = center.x || 0;
            y = center.y || 0;
            r = EDGE_RADIUS;
            break;
        case 'endpoint':
            const endpoint = target.getEndPoint();
            x = endpoint.x || 0;
            y = endpoint.y || 0;
            r = ENDPOINT_RADIUS;
            break;
        case 'initial':
            x = target.x + INITIAL_MARKER_OFFSET_X;
            y = target.y || 0;
            r = EDGE_RADIUS;
            break;
        }

        return (
            <g className="graph-highlight-container">
                <circle className={'graph-highlight ' + this.props.className}
                    cx={x} cy={y}
                    r={r + HIGHLIGHT_RADIUS_OFFSET}
                    strokeDashoffset={this.props.offset || 0}
                    strokeDasharray={HIGHLIGHT_LINE_ARRAY}
                    strokeWidth={HIGHLIGHT_LINE_WIDTH}
                    fill="none"/>
            </g>
        );
    }
}

export default HighlightRenderer;
