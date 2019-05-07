import React from 'react';

export const EVENT_SOURCE_INITIAL_MARKER = 'initial-marker';

class InitialMarkerRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const visible = this.props.visible;
        let x = this.props.x || 0;
        let y = this.props.y || 0;
        const radians = this.props.radians || 0;
        const offset = this.props.offset || 16;
        const size = this.props.size || 24;
        const color = this.props.color || '#000000';

        const dx = Math.cos(radians);
        const dy = Math.sin(radians);
        x += dx * offset;
        y += dy * offset;
        const radiusX = dx * size;
        const diameterX = radiusX * 2;
        const radiusY = dy * size;

        return (
            <g>
                {visible &&
					<path className="graph-initial" d={
					    'M' + x + ' ' + y +
						' L' + (x + diameterX) + ' ' + (y + radiusY) +
						' L' + (x + diameterX) + ' ' + (y - radiusY) +
						' Z'}

					fill="transparent"
					stroke={color}
					cursor="pointer"
					onMouseOver={this.props.onMouseOver}
					onMouseOut={this.props.onMouseOut}
					pointerEvents={this.props.pointerEvents} />}
            </g>
        );
    }
}

export default InitialMarkerRenderer;
