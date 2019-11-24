import AboutPanel from './AboutPanel.jsx';

import NodeGraphExporter from './NodeGraphExporter.js';
import { IMAGE_EXPORTERS } from './NodeGraphImageExporters.js';
import NodeGraphImporter from '@flapjs/modules/base/NodeGraphImporter.js';

import AutoSaveService from '@flapjs/services/AutoSaveService.js';
import UndoService from '@flapjs/services/UndoService.js';
import GraphService from '@flapjs/services/GraphService.js';
import ExportService from '@flapjs/services/ExportService.js';
import ImportService from '@flapjs/services/ImportService.js';
import NotificationService from '@flapjs/services/NotificationService.js';

import BaseGraphController from './BaseGraphController.js';
import { INSTANCE as NODE_PARSER } from '@flapjs/services/graph/model/parser/NodeGraphParser.js';
import GraphViewportLayer from '@flapjs/components/graph/GraphViewportLayer.jsx';
import BasePlaygroundLayer from '@flapjs/modules/base/BasePlaygroundLayer.jsx';

// Theme Manager
// Hotkeys?
// Tooltips

const MODULE = {
    id: 'base',
    version: '1.0.0',
    services: [
        ExportService,
        ImportService,
        NotificationService,
        UndoService,
        GraphService,
        AutoSaveService,
    ],
    renders: {
        appbar: [ ],
        playground: [ BasePlaygroundLayer ],
        viewport: [ GraphViewportLayer ],
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
            default:
                throw new Error(`Unsupported action ${action}.`);
        }
    },
    preload(session)
    {
    },
    load(session)
    {
        // This is called after all services have been created, but before they are loaded.
        // This is usually where you setup the session to be loaded correctly (instead of passing args to constructor).
        session.importService
            .addImporter(
                new NodeGraphImporter(NODE_PARSER,
                    [ '.json', '.base.json', '.fa.json', '.fsa.json' ])
            );
        session.exportService
            .setExports({
                session: new NodeGraphExporter(NODE_PARSER),
                ...IMAGE_EXPORTERS
            });
        session.graphService
            .setGraphParser(NODE_PARSER)
            .setGraphControllerClass(BaseGraphController)
            .enableAutoSaveServiceFeatures(session.autoSaveService)
            .enableUndoServiceFeatures(session.undoService);
    },
    postload(session)
    {
        // This is called after all services have been created AND loaded, but before they are rendered.
        // This is usually where you load the state for the services or session.
        session.graphController.getGraph().createNode();
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

