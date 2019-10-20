import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';

import IndexedNodeGraph from '@flapjs/deprecated/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/deprecated/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/deprecated/graph/model/elements/QuadraticEdge.js';
import GraphController from '@flapjs/deprecated/graph/controller/GraphController.js';
import InputController from '@flapjs/deprecated/graph/controller/InputController.js';
import ViewController from '@flapjs/deprecated/graph/controller/ViewController.js';
import { MODE_MOVE } from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';

import NodeGraphExporter from './NodeGraphExporter.js';
import { IMAGE_EXPORTERS } from './NodeGraphImageExporters.js';
import * as NodeGraphParser from './NodeGraphParser.js';

const MODULE = {
    id: 'base',
    version: '1.0.0',
    renders: {
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
    },
    imports: {
        /*
        session: SessionImporter,
        graph: NodalGraphImageExporter,
        jflap: JFLAPImporter,
        */
    },
    exports: {
        session: new NodeGraphExporter(NodeGraphParser.JSON),
        ...IMAGE_EXPORTERS
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
    // HACK: This forces everything to re-render every time something either in the graph, input, or view changes.
    // This is pretty bad practice. If something depends on one of those 3 things, they should
    // register themselves with that controller's change handler.
    onSessionDidMount(session)
    {
        this._onGraphChange = this.onGraphChange.bind(this, session);
        this._onInputChange = this.onInputChange.bind(this, session);
        this._onViewChange = this.onViewChange.bind(this, session);
        session.state.graphController.getGraphChangeHandler().addListener(this._onGraphChange);
        session.state.inputController.getChangeHandler().addListener(this._onInputChange);
        session.state.viewController.getChangeHandler().addListener(this._onViewChange);
    },
    onSessionRestart(session)
    {
        // FIXME: Not yet implemented.
    },
    onSessionWillUnmount(session)
    {
        session.state.graphController.getGraphChangeHandler().removeListener(this._onGraphChange);
        session.state.inputController.getChangeHandler().removeListener(this._onInputChange);
        session.state.viewController.getChangeHandler().removeListener(this._onViewChange);
    },
    onGraphChange(session, graph, hash)
    {
        session.setState({ graphHash: hash });
    },
    onViewChange(session, viewport, hash)
    {
        session.setState({ viewHash: hash });
    },
    onInputChange(session, input, hash)
    {
        session.setState({ inputHash: hash });
    }
};

export default MODULE;

