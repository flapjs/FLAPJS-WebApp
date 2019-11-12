import ExportService from '@flapjs/services/ExportService.js';
import ImportService from '@flapjs/services/ImportService.js';
import NotificationService from '@flapjs/services/NotificationService.js';
import UndoService from '@flapjs/services/UndoService.js';
import GraphService from '@flapjs/services/GraphService.js';
import AutoSaveService from '@flapjs/services/AutoSaveService.js';

import AnalysisPanel from '@flapjs/modules/fa/components/panels/AnalysisPanel.jsx';
import TestingPanel from '@flapjs/modules/fa/components/panels/TestingPanel.jsx';
import OverviewPanel from '@flapjs/modules/fa/components/panels/OverviewPanel.jsx';

import FSAGraphController from '@flapjs/modules/fa/graph/FSAGraphController.js';
import FSAPlaygroundLayer from '@flapjs/modules/fa/components/layers/FSAPlaygroundLayer.jsx';
import FSAViewportLayer from '@flapjs/modules/fa/components/layers/FSAViewportLayer.jsx';

import { INSTANCE as FSA_PARSER } from '@flapjs/modules/fa/loaders/FSAGraphParser.js';
import { INSTANCE as JFF_PARSER } from '@flapjs/modules/fa/loaders/JFFGraphParser.js';
import JFFImporter from '@flapjs/modules/fa/loaders/JFFImporter.js';
import JFFExporter from '@flapjs/modules/fa/loaders/JFFExporter.js';
import FSAImporter from '@flapjs/modules/fa/loaders/FSAImporter.js';
import FSAExporter from '@flapjs/modules/fa/loaders/FSAExporter';
import { IMAGE_EXPORTERS } from '../base/NodeGraphImageExporters.js';
// import FSAMachineController from '@flapjs/modules/fa/FSAMachineController.js';

const MODULE = {
    id: 'fa',
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
            .addImporter(
                new FSAImporter(FSA_PARSER, ['.json', '.fa.json', '.fsa.json']),
                new JFFImporter(JFF_PARSER, [ '.jff' ])
            );
        session.exportService
            .setExports({
                session: new FSAExporter(FSA_PARSER),
                jflap: new JFFExporter(JFF_PARSER),
                ...IMAGE_EXPORTERS
            });
        session.graphService
            .setGraphParser(FSA_PARSER)
            .setGraphControllerClass(FSAGraphController)
            // .setMachineControllerClass(FSAMachineController)
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
    }
};

export default MODULE;
