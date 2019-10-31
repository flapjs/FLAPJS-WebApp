import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import BaseToolbarLayer from './BaseToolbarLayer.jsx';
import AboutPanel from './AboutPanel.jsx';

import IndexedNodeGraph from '@flapjs/systems/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/systems/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/systems/graph/model/elements/QuadraticEdge.js';
import InputController from '@flapjs/systems/graph/controller/InputController.js';
import ViewController from '@flapjs/systems/graph/controller/ViewController.js';
import { MODE_MOVE } from '@flapjs/systems/graph/components/widgets/ModeTrayWidget.jsx';

import NodeGraphController from './NodeGraphController.js';
import NodeGraphExporter from './NodeGraphExporter.js';
import { IMAGE_EXPORTERS } from './NodeGraphImageExporters.js';
import * as NodeGraphParser from './NodeGraphParser.js';
import UndoManager from '@flapjs/deprecated/undo/UndoManager.js';
import SafeGraphEventHandler from '@flapjs/modules/base/SafeGraphEventHandler.js';
import NodeGraphImporter from '@flapjs/modules/base/NodeGraphImporter.js';

/*
import AutoSaveManager from '@flapjs/systems/autosave/AutoSaveManager.js';
import LocalStorage from '@flapjs/util/storage/LocalStorage.js';
import NodeGraphSaveHandler from '@flapjs/modules/base/NodeGraphSaveHandler.js';
import NodeGraphImporter from '@flapjs/modules/base/NodeGraphImporter.js';
*/

// Theme Manager
// Hotkeys?
// Tooltips

const MODULE = {
    id: 'base',
    version: '1.0.0',
    renders: {
        appbar: [ BaseToolbarLayer ],
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
    },
    imports: [
        new NodeGraphImporter(NodeGraphParser.JSON, [ '.fa.json', '.fsa.json' ])
    ],
    exports: {
        session: new NodeGraphExporter(NodeGraphParser.JSON),
        ...IMAGE_EXPORTERS
    },
    menus: {
        file: [
            // NewMenuOption,
            // SaveMenuOption,
        ],
        view: [
            // RecenterMenuOption,
        ]
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
        const graphController = new NodeGraphController(graph, state);
        const inputController = new InputController();
        const viewController = new ViewController();
        const undoManager = new UndoManager(() => new SafeGraphEventHandler(graphController, NodeGraphParser.JSON));
        // const autoSaveManager = new AutoSaveManager(LocalStorage).registerHandler(new NodeGraphSaveHandler(this));

        viewController.initialize();
        inputController.initialize();
        graphController.initialize();
        // autoSaveManager.initialize();

        state.graphController = graphController;
        state.inputController = inputController;
        state.viewController = viewController;
        state.undoManager = undoManager;
        // state.autoSaveManager = autoSaveManager;

        graph.createNode();
    },
    unload(state)
    {
        // state.autoSaveManager.terminate();
        state.undoManager.clear();
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

