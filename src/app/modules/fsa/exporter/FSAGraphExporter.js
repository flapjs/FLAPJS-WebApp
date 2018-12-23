import AbstractGraphExporter from 'modules/base/exporter/AbstractGraphExporter.js';

import JSONIcon from 'icons/flat/JSONIcon.js';
import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import Downloader from 'util/Downloader.js';

class FSAGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  fromJSON(data, app)
  {
    const graphController = app.graphController;
    const machineController = app.machineController;
    const machineBuilder = machineController.getMachineBuilder();
    const graph = graphController.getGraph();

    const metadata = '_metadata' in data ? data['_metadata'] : {};
    const newGraph = JSONGraphParser.parse(data.graphData, graph);

    //HACK: this should be calculated elsewhere
    const machineData = data.machineData;
    const machineName = machineData.name;
    if (machineName) machineController.setMachineName(machineName);
    const machineType = machineData.type;
    if (machineType) machineController.setMachineType(machineType);
    const customSymbols = machineData.symbols;
    if (customSymbols)
    {
      machineBuilder._symbols.length = 0;
      for(const symbol of customSymbols)
      {
        machineBuilder._symbols.push(symbol);
      }
    }
    const statePrefix = machineData.statePrefix;
    if (statePrefix) machineBuilder.getLabeler().prefix = statePrefix;

    return newGraph;
  }

  toJSON(graphData, app)
  {
    const module = app.getCurrentModule();
    const graphController = app.graphController;
    const machineController = app.machineController;
    const machineBuilder = machineController.getMachineBuilder();

    const dst = {};
    dst["_metadata"] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    dst["graphData"] = graphData;
    dst["machineData"] = {
      name: machineController.getMachineName(),
      type: machineController.getMachineType(),
      symbols: machineController.getCustomSymbols(),
      statePrefix: machineBuilder.getLabeler().prefix
    };
    return dst;
  }

  //Override
  importFromData(data, app)
  {
    this.fromJSON(data, app);
  }

  //Override
  exportToData(app)
  {
    const graph = app.graphController.getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const result = this.toJSON(graphData, app);
    return result;
  }

  //Override
  doesSupportData()
  {
    return true;
  }

  //Override
  importFromFile(fileBlob, app)
  {
    return new Promise((resolve, reject) => {
      const filename = fileBlob.name;
      if (!filename.endsWith(this.getFileType()))
      {
        throw new Error("Trying to import invalid file type for \'" + this.getFileType() + "\': " + filename);
      }

      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const graph = app.graphController.getGraph();

        //TODO: this should not be here, this should exist somewhere in graphController
        app.graphController.emit("userPreImportGraph", graph);

        try
        {
          const jsonData = JSON.parse(data);

          this.fromJSON(jsonData, app);

          app.graphController.emit("userImportGraph", graph);

          if (app.machineController)
          {
            app.machineController.setMachineName(name);
          }

          resolve();
        }
        catch (e)
        {
          reader.abort();
          reject(e);
        }
        finally
        {
          app.graphController.emit("userPostImportGraph", graph);
        }
      };

      reader.onerror = e => {
        reject(new Error("Unable to import file: " + e.target.error.code));
      }

      reader.readAsText(fileBlob);
    });
  }

  //Override
  exportToFile(filename, app)
  {
    const graph = app.graphController.getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const dst = this.toJSON(graphData, app);
    const jsonString = JSON.stringify(dst);
    Downloader.downloadText(filename + '.fsa.' + this.getFileType(), jsonString);
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
  getIconComponentClass()
  {
    return JSONIcon;
  }
}

export default FSAGraphExporter;
