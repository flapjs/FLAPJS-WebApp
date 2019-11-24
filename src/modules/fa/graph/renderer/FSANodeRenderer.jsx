/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import NodeRenderer from '@flapjs/services/graph/components/renderer/NodeRenderer.jsx';

class FSANodeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const fill = this.props.fill;
        const stroke = this.props.stroke;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const pointerEvents = this.props.pointerEvents;

        const label = node.getNodeLabel();
        const radius = node.getNodeSize();

        const accept = node.getNodeAccept();

        return (
            <>
                <NodeRenderer
                    position={node}
                    radius={radius}
                    label={label}
                    color={fill}
                    outline={stroke}
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
                {accept &&
                    <NodeRenderer
                        position={node}
                        radius={radius * 0.7}
                        color='none'
                        outline={stroke} />}
            </>
        );
    }
}
FSANodeRenderer.propTypes = {
    node: PropTypes.any,
    fill: PropTypes.any,
    stroke: PropTypes.any,
    onMouseOver: PropTypes.any,
    onMouseOut: PropTypes.any,
    pointerEvents: PropTypes.any,
};

export default FSANodeRenderer;
