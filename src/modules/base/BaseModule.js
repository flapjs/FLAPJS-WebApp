import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';
import IndexedNodeGraph from '@flapjs/deprecated/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/deprecated/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/deprecated/graph/model/elements/QuadraticEdge.js';
import GraphController from '@flapjs/deprecated/graph/controller/GraphController.js';
import InputController from '@flapjs/deprecated/graph/controller/InputController.js';
import ViewController from '@flapjs/deprecated/graph/controller/ViewController.js';

const MODULE = {
    id: 'base',
    onInitialization(session)
    {
        session.renders.add('playground', BasePlaygroundLayer);
        session.renders.add('viewport', BaseViewportLayer);
        session.renders.add('drawer', AboutPanel);

        const graph = new IndexedNodeGraph(GraphNode, QuadraticEdge);
        const graphController = new GraphController(graph);
        const inputController = new InputController();
        const viewController = new ViewController();

        viewController.initialize();
        inputController.initialize();
        graphController.initialize();

        graph.createNode();

        session.graphController = graphController;
        session.inputController = inputController;
        session.viewController = viewController;
    },
    onTermination(session)
    {
        session.graphController.terminate();
        session.inputController.terminate();
        session.viewController.terminate();
        
        delete session.graphController;
        delete session.inputController;
        delete session.viewController;
    }
};

export default MODULE;

