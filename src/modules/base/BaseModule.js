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

// Theme Manager
// Hotkeys?
// Tooltips

const MODULE = {
    id: 'base',
    version: '1.0.0',
    services: {
        autoSaveService: AutoSaveService,
        undoService: UndoService,
        graphService: GraphService,
    },
    renders: {
        appbar: [ ],
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
    preload(session)
    {
        session.graphService.setGraph(new IndexedNodeGraph(GraphNode, QuadraticEdge));
        session.undoService.setEventHandlerFactory(() => new SafeUndoNodeGraphEventHandler(session.graphController, NodeGraphParser.JSON));
        session.autoSaveService.setAutoSaveHandler(new NodeGraphSaveHandler(session));
    },
    load(session)
    {
        session.graphService.graph.createNode();
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

