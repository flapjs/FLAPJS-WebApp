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
    renders: {
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
    },
    load(state)
    {
        const graph = new IndexedNodeGraph(GraphNode, QuadraticEdge);
        const graphController = new GraphController(graph);
        const inputController = new InputController();
        const viewController = new ViewController();

        viewController.initialize();
        inputController.initialize();
        graphController.initialize();

        graph.createNode();

        state.graphController = graphController;
        state.inputController = inputController;
        state.viewController = viewController;
    },
    unload(state)
    {
        state.graphController.terminate();
        state.inputController.terminate();
        state.viewController.terminate();
    },
    reducer(state, action)
    {
        switch(action.type)
        {
            case 'set':
                break;
            default:
                throw new Error('Unknown action');
        }
    },
    onSessionDidMount(session)
    {
        // Do nothing yet...
    }
};

export default MODULE;

