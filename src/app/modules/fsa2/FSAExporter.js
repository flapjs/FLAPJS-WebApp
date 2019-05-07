import Exporter from 'session/manager/exporter/Exporter.js';

// TODO: add class docs
class FSAExporter extends Exporter
{
    // TODO: add constructor docs
    constructor(graphParser)
    {
        super();

        this._graphParser = graphParser;
    }

    /**
   * @override
   * @param  {String} filename    the name of the exported file
   * @param  {FSAModule} target   the module to export
   * @return {Promise}            the async export call
   */
    exportToFile(filename, target)
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

    /**
   * @overrde
   * @param  {FSAModule} target the module to export
   * @return {Boolean} whether the module can be exported in its current state
   */
    isValidTarget(target)
    {
        return target && !target.getGraphController().getGraph().isEmpty();
    }
}

export default FSAExporter;
