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

import AutoSaveManager from '@flapjs/systems/autosave/AutoSaveManager.js';
import LocalStorage from '@flapjs/util/storage/LocalStorage.js';
import NodeGraphSaveHandler from '@flapjs/modules/base/NodeGraphSaveHandler.js';

// Theme Manager
// Hotkeys?
// Tooltips

const MODULE = {
    id: 'base',
    version: '1.0.0',
    services: {
        /*
        undo: {
            component: UndoManagerPro,
            props: {}
        }
        */
    },
    renders: {
        appbar: [ BaseToolbarLayer ],
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
    },
    imports: [
        new NodeGraphImporter(NodeGraphParser.JSON, [ '.json', '.base.json', '.fa.json', '.fsa.json' ])
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
    load(session)
    {
        // console.log("LOAD");
        const graph = new IndexedNodeGraph(GraphNode, QuadraticEdge);
        const graphController = new NodeGraphController(graph, session);
        const inputController = new InputController();
        const viewController = new ViewController();
        const undoManager = new UndoManager(() => new SafeGraphEventHandler(graphController, NodeGraphParser.JSON));
        const autoSaveManager = new AutoSaveManager(LocalStorage)
            .registerHandler(new NodeGraphSaveHandler(session, session.importManager, session.exportManager));

        viewController.initialize();
        inputController.initialize();
        graphController.initialize();
        autoSaveManager.initialize();

        session.graphController = graphController;
        session.inputController = inputController;
        session.viewController = viewController;
        session.undoManager = undoManager;
        session.autoSaveManager = autoSaveManager;

        graph.createNode();
    },
    unload(session)
    {
        // console.log("UNLOAD");
        session.autoSaveManager.terminate();
        session.undoManager.clear();
        session.graphController.terminate();
        session.inputController.terminate();
        session.viewController.terminate();
    },
    // HACK: This forces everything to re-render every time something either in the graph, input, or view changes.
    // This is pretty bad practice. If something depends on one of those 3 things, they should
    // register themselves with that controller's change handler.
    onSessionDidMount(sessionProvider)
    {
        // console.log("MOUNT");
        this._onGraphChange = this.onGraphChange.bind(this, sessionProvider);
        this._onInputChange = this.onInputChange.bind(this, sessionProvider);
        this._onViewChange = this.onViewChange.bind(this, sessionProvider);
        sessionProvider.state.graphController.getGraphChangeHandler().addListener(this._onGraphChange);
        sessionProvider.state.inputController.getChangeHandler().addListener(this._onInputChange);
        sessionProvider.state.viewController.getChangeHandler().addListener(this._onViewChange);
    },
    onSessionRestart(sessionProvider)
    {
        // FIXME: Not yet implemented.
    },
    onSessionWillUnmount(sessionProvider)
    {
        // console.log("UNMOUNT");
        sessionProvider.state.graphController.getGraphChangeHandler().removeListener(this._onGraphChange);
        sessionProvider.state.inputController.getChangeHandler().removeListener(this._onInputChange);
        sessionProvider.state.viewController.getChangeHandler().removeListener(this._onViewChange);
    },
    onGraphChange(sessionProvider, graph, hash)
    {
        sessionProvider.setState({ graphHash: hash });
    },
    onViewChange(sessionProvider, viewport, hash)
    {
        sessionProvider.setState({ viewHash: hash });
    },
    onInputChange(sessionProvider, input, hash)
    {
        sessionProvider.setState({ inputHash: hash });
    }
};

export default MODULE;

