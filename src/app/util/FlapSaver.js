import NodalGraph from 'graph/NodalGraph.js';
import NodalGraphParser from 'graph/NodalGraphParser.js';

import Notification from 'system/notification/Notification.js';
import SemanticVersion from 'util/SemanticVersion.js';

export const CURRENT_VERSION = new SemanticVersion(0, 2, 0);
export const CURRENT_VERSION_STRING = SemanticVersion.stringify(CURRENT_VERSION);

export function saveToJSON(graphController, machineController)
{
  const graph = graphController.getGraph();

  if (!graph.isEmpty())
  {
    const dst = {};
    dst["metadata"] = {version: CURRENT_VERSION_STRING};
    dst["graphData"] = NodalGraphParser.toJSON(graph);

    //HACK: this should be calculated elsewhere
    dst["machineData"] = {
      name: machineController.getMachineName(),
      type: machineController.getMachineType(),
      symbols: machineController.getCustomSymbols()
    };

    return dst;
  }
  else
  {
    return {};
  }
};

export function loadFromJSON(jsonData, graphController, machineController)
{
  const graph = graphController.getGraph();
  const machineBuilder = machineController.getMachineBuilder();

  try
  {
    const metadata = jsonData.metadata;
    if (typeof metadata == 'object')
    {
      const dataVersion = SemanticVersion.parse(metadata.version);
      if (!CURRENT_VERSION.canSupportVersion(dataVersion))
      {
        Notification.addErrorMessage("ERROR: Unable to load invalid JSON file - invalid version.", "errorUpload");
        return;
      }
    }
    const graphJSON = jsonData.graphData;
    const newGraph = NodalGraphParser.parseJSON(graphJSON);
    graph.copyGraph(newGraph);

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
  }
  catch (e)
  {
    Notification.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");

    console.error(e);
  }
};
