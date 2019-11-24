import React from 'react';
import PropTypes from 'prop-types';

import GraphNodeLayer from '@flapjs/services/graph/components/layers/GraphNodeLayer.jsx';
import GraphEdgeLayer from '@flapjs/services/graph/components/layers/GraphEdgeLayer.jsx';
import SelectionBoxLayer from '@flapjs/services/graph/components/layers/SelectionBoxLayer.jsx';
import IndexedGraphStartMarkerLayer from '@flapjs/services/graph/components/layers/IndexedGraphStartMarkerLayer.jsx';

class NodeGraphLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;
        const inputContext = props.inputContext;
        const editable = props.editable;

        const graphController = props.graphController;
        const inputController = props.inputController;
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
NodeGraphLayer.propTypes = {
    inputContext: PropTypes.object.isRequired,
    inputController: PropTypes.object.isRequired,
    graphController: PropTypes.object.isRequired,
    editable: PropTypes.bool,
};
NodeGraphLayer.defaultProps = {
    editable: true
};

export default NodeGraphLayer;
