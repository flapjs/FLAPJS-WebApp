import Importer from 'util/file/import/Importer.js';

class REImporter extends Importer
{
    constructor(app, reModule)
    {
        super();

        this._app = app;
        this._module = reModule;
    }

    /** @override */
    importFileData(fileName, fileType, fileData)
    {
        const app = this._app;
        const currentModule = this._module;
        const machineController = currentModule.getMachineController();
        const expression = machineController.getMachineExpression();

        const result = JSON.parse(fileData);

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!expression)
        {
            app.getUndoManager().captureEvent();
        }

        // const metadata = '_metadata' in result ? result['_metadata'] : {};
        const machineExpression = result['machineData']['expression'];
        if (machineExpression) machineController.setMachineExpression(machineExpression);
        
        const projectName = fileName.substring(0, fileName.length - fileType.length);
        app.getSession().setProjectName(projectName);

        // compares GraphHash before and after import, captures event if they are not equal
        if (expression !== machineExpression)
        {
            // TODO: this should not be here
            app.getUndoManager().captureEvent();
        }

        return currentModule;
    }
}

export default REImporter;
