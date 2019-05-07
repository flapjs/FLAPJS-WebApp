import Importer from 'session/manager/exporter/Importer.js';

export default class FSAImporter extends Importer
{
    constructor(graphParser)
    {
        super();

        this._graphParser = graphParser;
    }

    /**
   * @override
   * @param  {String} filename    the name of the imported file
   * @param  {Object} fileData    the data to import
   * @return {Promise}            the async import call
   */
    importFromFile(filename, fileData)
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                const metadata = {
                    module: target.getModuleName(),
                    version: process.env.VERSION + ':' + target.getModuleVersion(),
                    timestamp: new Date().toString()
                };
                const graphData = this._graphParser.compose(target);

                //This should really be split into sessionData and machineData
                const graphController = target.getGraphController();
                const machineController = target.getMachineController();
                const machineData = {
                    name: target.getApp().getSession().getProjectName(),
                    type: machineController.getMachineType(),
                    symbols: machineController.getCustomSymbols(),
                    statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
                };
                const fileData = {
                    _metadata: metadata,
                    graphData: graphData,
                    machineData: machineData
                };
                resolve(fileData);
            }
            catch (e)
            {
                reject(e);
            }
        }).then(fileData => super.exportToFile(fileData));
    }
}
