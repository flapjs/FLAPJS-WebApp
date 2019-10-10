import React from 'react';
import PropTypes from 'prop-types';

const FILL_OPACITY = 0.1;

class BoxRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const visible = this.props.visible;
        const fromX = this.props.fromX || 0;
        const fromY = this.props.fromY || 0;
        const toX = this.props.toX || fromX + 1;
        const toY = this.props.toY || fromY + 1;
        const color = this.props.color || '#000000';

        const dx = toX - fromX;
        const dy = toY - fromY;

        return (
            <g>
                {visible &&
                    <rect className="graph-ui"
                        x={Math.min(toX, fromX)}
                        y={Math.min(toY, fromY)}
                        width={Math.abs(dx)}
                        height={Math.abs(dy)}
                        stroke={color}
                        fill={color}
                        fillOpacity={FILL_OPACITY} />}
            </g>
        );
    }
}
BoxRenderer.propTypes = {
    visible: PropTypes.bool,
    fromX: PropTypes.number,
    fromY: PropTypes.number,
    toX: PropTypes.number,
    toY: PropTypes.number,
    color: PropTypes.string,
};

export default BoxRenderer;
