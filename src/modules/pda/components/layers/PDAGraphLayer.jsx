import React from 'react';
import PropTypes from 'prop-types';

import GraphNodeLayer from '@flapjs/services/graph/components/layers/GraphNodeLayer.jsx';
import GraphEdgeLayer from '@flapjs/services/graph/components/layers/GraphEdgeLayer.jsx';
import SelectionBoxLayer from '@flapjs/services/graph/components/layers/SelectionBoxLayer.jsx';
import IndexedGraphStartMarkerLayer from '@flapjs/services/graph/components/layers/IndexedGraphStartMarkerLayer.jsx';
import FSANodeInputHandler from '@flapjs/modules/fa/graph/inputhandler/FSANodeInputHandler';
import FSANodeRenderer from '@flapjs/modules/fa/graph/renderer/FSANodeRenderer.jsx';
import FSAEdgeRenderer from '@flapjs/modules/fa/graph/renderer/FSAEdgeRenderer.jsx';

class PDAGraphLayer extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this._pdaNodeInputHandler = null;
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        this._pdaNodeInputHandler = new FSANodeInputHandler(this.props.inputController, this.props.graphController);
        inputContext.addInputHandler(this._pdaNodeInputHandler);
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        inputContext.removeInputHandler(this._pdaNodeInputHandler);
        this._pdaNodeInputHandler = null;
    }

    /** @override */
    render()
    {
        const graphController = this.props.graphController;
        const inputController = this.props.inputController;
        const inputContext = this.props.inputContext;
        const editable = this.props.editable;

        const graph = graphController.getGraph();

        return (
            <>
                <IndexedGraphStartMarkerLayer
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable}
                    color={'red'/*'var(--color-graph-text)'*/} />
                <GraphNodeLayer
                    nodes={graph.getNodes()}
                    nodeRenderer={FSANodeRenderer}
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable}
                    fill={'gold'/*'var(--color-graph-node)'*/}
                    stroke={'black'/*'var(--color-graph-text)'*/}/>
                <GraphEdgeLayer
                    edges={graph.getEdges()}
                    edgeRenderer={FSAEdgeRenderer}
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable}
                    stroke={'blue'/*'var(--color-graph-text)'*/} />
                <SelectionBoxLayer
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1} />
            </>
        );
    }
}
PDAGraphLayer.propTypes = {
    inputContext: PropTypes.object.isRequired,
    inputController: PropTypes.object.isRequired,
    graphController: PropTypes.object.isRequired,
    editable: PropTypes.bool,
};
PDAGraphLayer.defaultProps = {
    editable: true
};

export default PDAGraphLayer;
