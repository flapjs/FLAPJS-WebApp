/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: Gotta fix this.

import React from 'react';
import PropTypes from 'prop-types';

import GraphNodeRenderer from '../renderer/GraphNodeRenderer.jsx';
import GraphNodeInputHandler from '../../controller/inputhandler/GraphNodeInputHandler.js';

class GraphNodeLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;

        this._graphNodeInputHandler = new GraphNodeInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._graphNodeInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._graphNodeInputHandler);
        }
    }

    getGraphNodeInputHandler() { return this._graphNodeInputHandler; }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const Renderer = this.props.nodeRenderer || GraphNodeRenderer;
        const editable = this.props.editable;

        const onMouseOver = inputController ? inputController.onMouseOver : null;
        const onMouseOut = inputController ? inputController.onMouseOut : null;

        const nodes = [];
        for (const node of this.props.nodes)
        {
            nodes.push(
                <Renderer
                    key={node.getGraphElementID()}
                    node={node}
                    fill={this.props.fill}
                    stroke={this.props.stroke}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    pointerEvents={editable && inputController && inputController.hasPointerEvents(node) ? 'all' : 'none'} />
            );
        }

        return (
            <g>
                {nodes}
            </g>
        );
    }
}
GraphNodeLayer.propTypes = {
    // TODO: Fix types.
    inputController: PropTypes.any,
    graphController: PropTypes.any,
    inputContext: PropTypes.any,
    inputPriority: PropTypes.any,
    nodes: PropTypes.any,
    nodeRenderer: PropTypes.any,
    editable: PropTypes.bool,
    stroke: PropTypes.string,
    fill: PropTypes.string,
};

export default GraphNodeLayer;
