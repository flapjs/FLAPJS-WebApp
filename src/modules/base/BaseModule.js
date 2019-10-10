import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';
import IndexedNodeGraph from '@flapjs/deprecated/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/deprecated/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/deprecated/graph/model/elements/QuadraticEdge.js';
import GraphController from '@flapjs/deprecated/graph/controller/GraphController.js';

const MODULE = {
    id: 'base',
    onInitialization(session)
    {
        session.renders.add('playground', BasePlaygroundLayer);
        session.renders.add('viewport', BaseViewportLayer);
        session.renders.add('drawer', AboutPanel);

        const graph = new IndexedNodeGraph(GraphNode, QuadraticEdge);
        const graphController = new GraphController(graph);

        graph.createNode();

        session.graphController = graphController;
    },
    onTermination(session)
    {
        session.graph.clear();
        
        delete session.graphController;
    }
};

export default MODULE;

