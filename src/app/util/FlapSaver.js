import NodalGraph from 'graph/NodalGraph.js';
import NodalGraphParser from 'graph/NodalGraphParser.js';

export function saveToJSON(graphController, machineController)
{
  const graph = graphController.getGraph();

  if (!graph.isEmpty())
  {
    const dst = {};
    dst.graphData = NodalGraphParser.toJSON(graph);

    //HACK: this should be calculated elsewhere
    dst.machineData = {
      name: machineController.getMachineName(),
      type: machineController.getMachineType(),
      symbols: machineController.getCustomSymbols()
    };

    return JSON.stringify(dst);
  }
  else
  {
    return "";
  }

  //Save if changes were made
  saveConfig();
};

export function loadFromJSON(stringData, graphController, machineController)
{
  const graph = graphController.getGraph();
  const machineBuilder = machineController.getMachineBuilder();

  try
  {
    const data = JSON.parse(stringData);
    const graphJSON = data.graphData;
    const newGraph = NodalGraphParser.parseJSON(graphJSON);
    graph.copyGraph(newGraph);

    //HACK: this should be calculated elsewhere
    const machineJSON = data.machineData;
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
    if (graphController.notification)
    {
      graphController.notification.addMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");
    }

    console.error(e);
  }
};
