/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: REMPVE THIS DAHWIEHFIAEF

import React from 'react';
import PropTypes from 'prop-types';

import StartMarkerRenderer from './StartMarkerRenderer.jsx';

class StartNodeMarkerRenderer extends React.Component
{
    constructor(props)
    {
        super(props);

        this._prevSize = 1;
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const color = this.props.color;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        let offset, size;
        if ('getNodeSize' in node)
        {
            offset = node.getNodeSize();
            size = node.getNodeSize() / 2;

            this._prevSize = size;
        }
        else
        {
            offset = 0;
            size = this._prevSize;
        }

        return (
            <React.Fragment>
                <StartMarkerRenderer
                    position={node}
                    offset={offset}
                    size={size}
                    color={color}
                    onMouseOver={onMouseOver ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = node;
                        onMouseOver(e);
                    } : null}
                    onMouseOut={onMouseOut ? e =>
                    {
                        const value = e.target['value'] || (e.target['value'] = {});
                        value.source = node;
                        onMouseOut(e);
                    } : null}
                    pointerEvents={pointerEvents} />
            </React.Fragment>
        );
    }
}
StartNodeMarkerRenderer.propTypes = {
    // TODO: Fix type
    node: PropTypes.any,
    color: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    pointerEvents: PropTypes.string,
};

export default StartNodeMarkerRenderer;
