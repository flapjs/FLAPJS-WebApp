/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: REMPVE THIS DAHWIEHFIAEF

import React from 'react';
import PropTypes from 'prop-types';

export const EVENT_SOURCE_START_MARKER = 'start-marker';

class StartMarkerRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const position = this.props.position;
        const radians = this.props.radians || Math.PI;
        const offset = this.props.offset || 0;
        const size = this.props.size || 24;
        const color = this.props.color || '#000000';

        const dx = Math.cos(radians);
        const dy = Math.sin(radians);
        const x = position.x + dx * offset;
        const y = position.y + dy * offset;

        // FIXME: this does not work for ALL arbitrary angles...
        const radiusX = dx * size;
        const diameterX = radiusX * 2;
        // const radiusY = dy * size;

        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        return (
            <g>
                <path
                    d={'M' + x + ' ' + y +
                        ' L' + (x + diameterX) + ' ' + (y + Math.sin(radians + Math.PI / 2) * size * 2) +
                        ' L' + (x + diameterX) + ' ' + (y - Math.sin(radians + Math.PI / 2) * size * 2) +
                        ' Z'}
                    fill="transparent"
                    stroke={color}
                    cursor="pointer"
                    onMouseOver={onMouseOver ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.type = EVENT_SOURCE_START_MARKER;
                        onMouseOver(e);
                    } : null}
                    onMouseOut={onMouseOut ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.type = EVENT_SOURCE_START_MARKER;
                        onMouseOut(e);
                    } : null}
                    pointerEvents={pointerEvents} />
            </g>
        );
    }
}
StartMarkerRenderer.propTypes = {
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    radians: PropTypes.number,
    offset: PropTypes.number,
    size: PropTypes.number,
    color: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

export default StartMarkerRenderer;
