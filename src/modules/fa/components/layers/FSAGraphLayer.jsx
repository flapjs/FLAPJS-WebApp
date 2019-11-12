import React from 'react';
import PropTypes from 'prop-types';

import GraphNodeLayer from '@flapjs/systems/graph/components/layers/GraphNodeLayer.jsx';
import GraphEdgeLayer from '@flapjs/systems/graph/components/layers/GraphEdgeLayer.jsx';
import SelectionBoxLayer from '@flapjs/systems/graph/components/layers/SelectionBoxLayer.jsx';
import IndexedGraphStartMarkerLayer from '@flapjs/systems/graph/components/layers/IndexedGraphStartMarkerLayer.jsx';

class FSAGraphLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        inputContext.addInputHandler(this._fsaNodeInputHandler);
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        inputContext.removeInputHandler(this._fsaNodeInputHandler);
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
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable}
                    fill={'gold'/*'var(--color-graph-node)'*/}
                    stroke={'black'/*'var(--color-graph-text)'*/}/>
                <GraphEdgeLayer
                    edges={graph.getEdges()}
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
FSAGraphLayer.propTypes = {
    inputContext: PropTypes.object.isRequired,
    inputController: PropTypes.object.isRequired,
    graphController: PropTypes.object.isRequired,
    editable: PropTypes.bool,
};
FSAGraphLayer.defaultProps = {
    editable: true
};

export default FSAGraphLayer;
