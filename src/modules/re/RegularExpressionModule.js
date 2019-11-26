import MachineService from '@flapjs/services/MachineService.js';
import REPlaygroundLayer from '@flapjs/modules/re/components/layers/REPlaygroundLayer.jsx';
import REMachineController from '@flapjs/modules/re/machine/REMachineController.js';
import ExportService from '@flapjs/services/ExportService.js';
import ImportService from '@flapjs/services/ImportService.js';
import REImporter from '@flapjs/modules/re/loaders/REImporter.js';
import REExporter from '@flapjs/modules/re/loaders/REExporter.js';

const MODULE = {
    id: 're',
    version: '1.0.0',
    services: [
        ExportService,
        ImportService,
        MachineService
    ],
    renders: {
        playground: [ REPlaygroundLayer ]
    },
    load(session)
    {
        // This is called after all services have been created, but before they are loaded.
        // This is usually where you setup the session to be loaded correctly (instead of passing args to constructor).
        session.importService
            .addImporter(new REImporter(['.json', '.re.json']));
        session.exportService
            .setExports({
                session: new REExporter()
            });
        session.machineService
            .setMachineControllerClass(REMachineController);
    }
};

export default MODULE;
