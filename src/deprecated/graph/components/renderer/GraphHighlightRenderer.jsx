import React from 'react';
import PropTypes from 'prop-types';

const HIGHLIGHT_LINE_WIDTH = 3;
const HIGHLIGHT_LINE_ARRAY = [8, 6];
const HIGHLIGHT_OFFSET = 0;

class GraphHighlightRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const center = this.props.center;
        const stroke = this.props.color || '#CCCCCC';
        const radius = this.props.radius || 24;

        return (
            <React.Fragment>
                <circle className="graph-ui"
                    cx={center.x} cy={center.y} r={radius}
                    stroke={stroke}
                    strokeDashoffset={HIGHLIGHT_OFFSET}
                    strokeDasharray={HIGHLIGHT_LINE_ARRAY}
                    strokeWidth={HIGHLIGHT_LINE_WIDTH}
                    fill="none"
                    pointerEvents="none" />
            </React.Fragment>
        );
    }
}
GraphHighlightRenderer.propTypes = {
    center: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    color: PropTypes.string,
    radius: PropTypes.number,
};

export default GraphHighlightRenderer;
