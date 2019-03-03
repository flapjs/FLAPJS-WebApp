import AbstractGraphExporter from 'modules/abstract/exporter/AbstractGraphExporter.js';

import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import { downloadText } from 'util/Downloader.js';

import JSONFileIcon from 'experimental/iconset/flat/JSONFileIcon.js';

class FSAGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  fromJSON(data, module)
  {
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();
    const graph = graphController.getGraph();

    const metadata = '_metadata' in data ? data['_metadata'] : {};
    const newGraph = JSONGraphParser.parse(data.graphData, graph);

    //HACK: this should be calculated elsewhere
    const machineData = data.machineData;
    const machineName = machineData.name;
    if (machineName) module.getApp().getSession().setProjectName(machineName);
    const machineType = machineData.type;
    if (machineType) machineController.setMachineType(machineType);
    const customSymbols = machineData.symbols;
    if (customSymbols && Array.isArray(customSymbols))
    {
      machineController.clearCustomSymbols();
      for(const symbol of customSymbols)
      {
        machineController.addCustomSymbol(symbol);
      }
    }
    const statePrefix = machineData.statePrefix;
    if (statePrefix)
    {
      graphController.getGraphLabeler().setDefaultNodeLabelPrefix(statePrefix);
    }

    return newGraph;
  }

  toJSON(graphData, module)
  {
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();

    const dst = {};
    dst["_metadata"] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    dst["graphData"] = graphData;
    dst["machineData"] = {
      name: module.getApp().getSession().getProjectName(),
      type: machineController.getMachineType(),
      symbols: machineController.getCustomSymbols(),
      statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
    };
    return dst;
  }

  //Override
  importFromData(data, module)
  {
    this.fromJSON(data, module);
  }

  //Override
  exportToData(module)
  {
    const graph = module.getGraphController().getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const result = this.toJSON(graphData, module);
    return result;
  }

  //Override
  doesSupportData()
  {
    return true;
  }

  //Override
  importFromFile(fileBlob, module)
  {
    return new Promise((resolve, reject) => {
      const filename = fileBlob.name;
      if (!filename.endsWith(this.getFileType()))
      {
        throw new Error("Trying to import invalid file type for \'" + this.getFileType() + "\': " + filename);
      }

      const reader = new FileReader();
      reader.onload = e => {
        const graphController = module.getGraphController();
        const machineController = module.getMachineController();
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const graph = graphController.getGraph();

        //TODO: this should not be here, this should exist somewhere in graphController
        module.getApp().getUndoManager().captureEvent();

        try
        {
          const jsonData = JSON.parse(data);

          this.fromJSON(jsonData, module);

          module.getApp().getSession().setProjectName(name);

          resolve();
        }
        catch (e)
        {
          reader.abort();
          reject(e);
        }
        finally
        {
          module.getApp().getUndoManager().captureEvent();
        }
      };

      reader.onerror = e => {
        reject(new Error("Unable to import file: " + e.target.error.code));
      }

      reader.readAsText(fileBlob);
    });
  }

  //Override
  exportToFile(filename, module)
  {
    const graph = module.getGraphController().getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const dst = this.toJSON(graphData, module);
    const jsonString = JSON.stringify(dst);
    downloadText(filename + '.' + this.getFileType(), jsonString);
  }

  //Override
  doesSupportFile()
  {
    return true;
  }

  //Override
  canImport()
  {
    return true;
  }

  //Override
  getTitle()
  {
    return I18N.toString("file.export.machine.hint");
  }

  //Override
  getLabel()
  {
    return I18N.toString("file.export.machine");
  }

  //Override
  getFileType()
  {
    return "json";
  }

  //Override
  getIconClass()
  {
    return JSONFileIcon;
  }
}

export default FSAGraphExporter;
