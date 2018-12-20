import Notifications from 'system/notification/Notifications.js';
import SemanticVersion from 'util/SemanticVersion.js';

//TODO: Should really only write metadata that is ambiguous to module
export function saveToJSON(graphData, graphController, machineController)
{
  const graph = graphController.getGraph();
  const machineBuilder = machineController.getMachineBuilder();

  const dst = {};
  dst["metadata"] = {version: process.env.VERSION};
  dst["graphData"] = graphData;

  //HACK: this should be calculated elsewhere
  dst["machineData"] = {
    name: machineController.getMachineName(),
    type: machineController.getMachineType(),
    symbols: machineController.getCustomSymbols(),
    statePrefix: machineBuilder.getLabeler().prefix
  };

  return dst;
};

export function loadFromJSON(jsonData, jsonParser, graphController, machineController)
{
  const graph = graphController.getGraph();
  const machineBuilder = machineController.getMachineBuilder();

  try
  {
    const metadata = jsonData.metadata;
    const graphJSON = jsonData.graphData;
    const newGraph = jsonParser.parse(graphJSON, graph);

    //HACK: this should be calculated elsewhere
    const machineJSON = jsonData.machineData;
    const name = machineJSON.name;
    if (name) machineController.setMachineName(name);
    const type = machineJSON.type;
    if (type) machineController.setMachineType(type);
    const customSymbols = machineJSON.symbols;
    if (customSymbols)
    {
      machineBuilder._symbols.length = 0;
      for(const symbol of customSymbols)
      {
        machineBuilder._symbols.push(symbol);
      }
    }
    const statePrefix = machineJSON.statePrefix;
    if (statePrefix) machineBuilder.getLabeler().prefix = statePrefix;
  }
  catch (e)
  {
    Notifications.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");

    console.error(e);
  }
};
