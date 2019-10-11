import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';
import IndexedNodeGraph from '@flapjs/deprecated/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/deprecated/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/deprecated/graph/model/elements/QuadraticEdge.js';
import GraphController from '@flapjs/deprecated/graph/controller/GraphController.js';
import InputController from '@flapjs/deprecated/graph/controller/InputController.js';
import ViewController from '@flapjs/deprecated/graph/controller/ViewController.js';
import {MODE_MOVE} from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';

const MODULE = {
    id: 'base',
    renders: {
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
    },
    reducer(state, action)
    {
        switch(action.type)
        {
            case 'trash-mode':
                state.inputController.setTrashMode(action.value);
                return { trashMode: action.value };
            case 'action-mode':
                state.inputController.setMoveModeFirst(action.value === MODE_MOVE);
                return { actionMode: action.value };
            case 'clear-graph':
                state.graphController.clearGraph();
                return { graphHash: state.graphController.getGraph().getHashCode() };
            default:
                throw new Error(`Unsupported action ${action}.`);
        }
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
    onSessionDidMount(session)
    {
        // Do nothing yet...
    }
};

export default MODULE;

