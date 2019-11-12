import AnalysisPanel from '@flapjs/modules/fa/components/panels/AnalysisPanel.jsx';
import TestingPanel from '@flapjs/modules/fa/components/panels/TestingPanel.jsx';
import OverviewPanel from '@flapjs/modules/fa/components/panels/OverviewPanel.jsx';
import ExportService from '@flapjs/services/ExportService.js';
import ImportService from '@flapjs/services/ImportService.js';
import NotificationService from '@flapjs/services/NotificationService.js';
import UndoService from '@flapjs/services/UndoService.js';
import GraphService from '@flapjs/services/GraphService.js';
import AutoSaveService from '@flapjs/services/AutoSaveService.js';
import FSAImporter from '@flapjs/modules/fa/loaders/FSAImporter.js';
import * as FSAGraphParser from '@flapjs/modules/fa/FSAGraphParser.js';
import FSAExporter from '@flapjs/modules/fa/loaders/FSAExporter';
import { IMAGE_EXPORTERS } from '../base/NodeGraphImageExporters.js';
import FSAGraph from '@flapjs/modules/fa/graph/FSAGraph.js';
import FSAGraphController from '@flapjs/modules/fa/graph/FSAGraphController.js';
import FSAPlaygroundLayer from '@flapjs/modules/fa/components/layers/FSAPlaygroundLayer.jsx';
import FSAViewportLayer from '@flapjs/modules/fa/components/layers/FSAViewportLayer.jsx';

const MODULE = {
    id: 'fa',
    version: '1.0.0',
    services: {
        exportService: ExportService,
        importService: ImportService,
        notificationService: NotificationService,
        undoService: UndoService,
        graphService: GraphService,
        autoSaveService: AutoSaveService
    },
    renders: {
        playground: [ FSAPlaygroundLayer ],
        viewport: [ FSAViewportLayer ],
        drawer: [
            OverviewPanel,
            TestingPanel,
            AnalysisPanel
        ]
    },
    reducer(state, action)
    {
        switch (action.type)
        {
            default:
                throw new Error(`Unsupported action ${action}.`);
        }
    },
    preload(session) { },
    load(session)
    {
        // This is called after all services have been created, but before they are loaded.
        // This is usually where you setup the session to be loaded correctly (instead of passing args to constructor).
        session.importService
            .addImporter(new FSAImporter(FSAGraphParser.JSON, ['.json', '.fa.json', '.fsa.json']));
        session.exportService
            .setExports({
                session: new FSAExporter(FSAGraphParser.JSON),
                ...IMAGE_EXPORTERS
            });
        session.graphService
            .setGraph(new FSAGraph())
            .setGraphParser(FSAGraphParser.JSON)
            .setGraphControllerClass(FSAGraphController)
            .enableAutoSaveServiceFeatures(session.autoSaveService)
            .enableUndoServiceFeatures(session.undoService);
    },
    postload(session)
    {
        // This is called after all services have been created AND loaded, but before they are rendered.
        // This is usually where you load the state for the services or session.
        session.graphService.graph.createNode();
        session.notificationService.notificationManager.pushNotification('Welcome to Flap.js!');
    },
    unload(session)
    {
    }
};

export default MODULE;
