import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';
import IndexedNodeGraph from '@flapjs/deprecated/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/deprecated/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/deprecated/graph/model/elements/QuadraticEdge.js';
import GraphController from '@flapjs/deprecated/graph/controller/GraphController.js';
import InputContext from '@flapjs/deprecated/graph/input/InputContext.js';
import InputController from '@flapjs/deprecated/graph/controller/InputController.js';

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

        const inputContext = new InputContext();
        const inputController = new InputController();
        inputContext.addInputHandler(inputController);

        session.graphController = graphController;
        session.inputContext = inputContext;
        session.inputController = inputController;
    },
    onTermination(session)
    {
        session.inputContext.clearInputHandlers();
        session.graph.clear();
        
        delete session.graphController;
        delete session.inputContext;
        delete session.inputController;
    }
};

export default MODULE;

