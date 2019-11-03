import BasePlaygroundLayer from './BasePlaygroundLayer.jsx';
import BaseViewportLayer from './BaseViewportLayer.jsx';
import AboutPanel from './AboutPanel.jsx';

import { MODE_MOVE } from '@flapjs/systems/graph/components/widgets/ModeTrayWidget.jsx';

import NodeGraphExporter from './NodeGraphExporter.js';
import { IMAGE_EXPORTERS } from './NodeGraphImageExporters.js';
import * as NodeGraphParser from './NodeGraphParser.js';
import NodeGraphImporter from '@flapjs/modules/base/NodeGraphImporter.js';

import AutoSaveService from '@flapjs/services/AutoSaveService.js';
import NodeGraphSaveHandler from '@flapjs/modules/base/NodeGraphSaveHandler';

import UndoService from '@flapjs/services/UndoService.js';
import SafeUndoNodeGraphEventHandler from '@flapjs/systems/graph/controller/SafeUndoNodeGraphEventHandler.js';

import GraphService from '@flapjs/services/GraphService.js';
import IndexedNodeGraph from '@flapjs/systems/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/systems/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/systems/graph/model/elements/QuadraticEdge.js';

import ExportService from '@flapjs/services/ExportService.js';
import ImportService from '@flapjs/services/ImportService.js';
import NotificationService from '@flapjs/services/NotificationService.js';

// Theme Manager
// Hotkeys?
// Tooltips

const MODULE = {
    id: 'base',
    version: '1.0.0',
    // TODO: Order is not guaranteed. This should probably be an array instead.
    services: {
        exportService: ExportService,
        importService: ImportService,
        notificationService: NotificationService,
        undoService: UndoService,
        graphService: GraphService,
        autoSaveService: AutoSaveService,
    },
    renders: {
        appbar: [ ],
        playground: [ BasePlaygroundLayer ],
        viewport: [ BaseViewportLayer ],
        drawer: [ AboutPanel ],
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
    preload(session)
    {
        // This is called after all services have been created, but before they are loaded.
        // This is usually where you setup the session to be loaded correctly (instead of passing args to constructor).
        session.importService.addImporter(new NodeGraphImporter(NodeGraphParser.JSON, [ '.json', '.base.json', '.fa.json', '.fsa.json' ]));
        session.exportService
            .setExports({
                session: new NodeGraphExporter(NodeGraphParser.JSON),
                ...IMAGE_EXPORTERS
            });
        session.graphService.setGraph(new IndexedNodeGraph(GraphNode, QuadraticEdge));
        session.undoService.setEventHandlerFactory(() => new SafeUndoNodeGraphEventHandler(session.graphController, NodeGraphParser.JSON));
        session.autoSaveService.setAutoSaveHandler(new NodeGraphSaveHandler(session));
    },
    load(session)
    {
        // This is called after all services have been created AND loaded, but before they are rendered.
        // This is usually where you load the state for the services or session.
        session.graphService.graph.createNode();
        session.notificationService.notificationManager.pushNotification('Welcome to Flap.js!');
    },
    unload(session)
    {
    },
    onSessionDidMount(sessionProvider)
    {
    },
    onSessionWillUnmount(sessionProvider)
    {
    }
};

export default MODULE;

