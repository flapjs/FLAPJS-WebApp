import JSONImporter, { FILE_TYPE_JSON } from 'session/manager/exporter/JSONImporter.js';

export const FILE_META_EXT = '.re' + FILE_TYPE_JSON;

class REImporter extends JSONImporter
{
    constructor(reModule)
    {
        super();

        this._module = reModule;
    }

    /** @override */
    importFromFile(fileName, fileData)
    {
        return super.importFromFile(fileName, fileData)
            .then(result =>
            {
                const currentModule = this._module;
                const machineController = currentModule.getMachineController();
                const expression = machineController.getMachineExpression();

                // TODO: this should not be here, this should exist somewhere in graphController
                if (!expression)
                {
                    currentModule.getApp().getUndoManager().captureEvent();
                }

                // const metadata = '_metadata' in result ? result['_metadata'] : {};
                const machineExpression = result['machineData']['expression'];
                if (machineExpression) machineController.setMachineExpression(machineExpression);
                
                const projectName = fileName.substring(0, fileName.length - FILE_META_EXT.length);
                currentModule.getApp().getSession().setProjectName(projectName);

                // compares GraphHash before and after import, captures event if they are not equal
                if (expression !== machineExpression)
                {
                    // TODO: this should not be here
                    currentModule.getApp().getUndoManager().captureEvent();
                }

                return currentModule;
            });
    }

    /** @override */
    isValidFile(fileName, fileData)
    {
        return fileName.endsWith(FILE_META_EXT) && super.isValidFile(fileName, fileData);
    }
}

export default REImporter;
