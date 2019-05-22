import SessionExporter from 'session/SessionExporter.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class REExporter extends SessionExporter
{
    constructor()
    {
        super('.re.json');
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        dst['machineData'] = {
            expression: machineController.getMachineExpression()
        };
    }
    
    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default REExporter;
