import AbstractGraphExporter from 'session/manager/export/AbstractGraphExporter.js';

import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import { downloadText } from 'util/Downloader.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class FSAGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  /**
   * setMachine - sets all of the details pertaining to the machine
   *
   * @param  {graphController} graphController   the Controller object for the graph to be constructed
   * @param  {machineController} machineController the Controller object for the machine to be constructed
   * @param  {machineData} machineData       the machine Data to be parsed
   * @param  {module} module            the module data to be modified
   * @return {None}                   description
   */
  setMachine(graphController, machineController, machineData, module){
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
  }

  /**
   * fromJSON - creates graph and machien from jsonData
   *
   * @param {jsonObject} jsonData - the jsonDAta contains all the information for the machine/graph
   * @param {module}  module -the module is used to construct the machien and constructor
   */
  fromJSON(jsonData, module)
  {
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();
    const graph = graphController.getGraph();

    const metadata = '_metadata' in jsonData ? jsonData['_metadata'] : {};
    const newGraph = JSONGraphParser.parse(jsonData.graphData, graph);

    //machien details are set
    setMachine(graphController, machineController, jsonData.machineData, module)


    return newGraph;
  }

  /**
   * toJSON - converts graph into a "dst" -what is a dst (should be made clear)
   * @param{graphData} graphData - the graphData intended to go into dst
   * @param{module} module - contains module data such as graphController, machineController, projectName, version, etc.
   */
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

  /** @override */
  importFromData(data, module)
  {
    this.fromJSON(data, module);
  }

  /** @override */
  exportToData(module)
  {
    const graph = module.getGraphController().getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const result = this.toJSON(graphData, module);
    return result;
  }

  /** @override */
  doesSupportData()
  {
    return true;
  }

  //Override

  /**
   * importFromFile - creates a graph from an input fileObject
   *
   * @param{fileObject} fileObject - file with data for constructing graph
   * @param{module} module  - module used in construction of graphData
   *
   */
  importFromFile(fileObject, module)
  {
    return new Promise((resolve, reject) => {
      const filename = fileObject.name;
      if (!filename.endsWith(this.getFileType()))
      {
        // TODO: log errors instead of just printing them to standard error
        throw new Error("Trying to import invalid file type for \'" + this.getFileType() + "\': " + filename);
      }

      const reader = new FileReader();
      // TODO: rename e to something more meaningful
      reader.onload = e => {
        const graphController = module.getGraphController();
        const machineController = module.getMachineController();
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const graph = graphController.getGraph();
        const prevGraphHash = graph.getHashCode(true);

        //TODO: this should not be here, this should exist somewhere in graphController
        // ^^ Where is somewhere?
        if (!graph.isEmpty())
        {
          module.getApp().getUndoManager().captureEvent();
        }

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
          //this section of code is unclear in what it does
          const nextGraphHash = graph.getHashCode(true);
          if (prevGraphHash !== nextGraphHash)
          {
            module.getApp().getUndoManager().captureEvent();
          }
        }
      };

      reader.onerror = e => {
        reject(new Error("Unable to import file: " + e.target.error.code));
      }

      reader.readAsText(fileObject);
    });
  }

  /**
   * exportToFile - creates a file that encodes graph details
   * @param{string} filename - name of the file to contain the encoded graphData
   * @param{module} module - module containing the graph to be encoded
   */
  //Override
  exportToFile(filename, module)
  {
    const graph = module.getGraphController().getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const dst = this.toJSON(graphData, module);
    const jsonString = JSON.stringify(dst);
    downloadText(filename + '.' + this.getFileType(), jsonString);
  }

  /** @override */
  doesSupportFile()
  {
    return true;
  }

  /** @override */
  canImport(module)
  {
    return true;
  }

  /** @override */
  canExport(module)
  {
    return !module.getGraphController().getGraph().isEmpty();
  }

  /** @override */
  getTitle()
  {
    return I18N.toString("file.export.machine.hint");
  }

  /** @override */
  getLabel()
  {
    return I18N.toString("file.export.machine");
  }

  /** @override */
  getFileType()
  {
    return "json";
  }

  /** @override */
  getIconClass()
  {
    return JSONFileIcon;
  }
}

export default FSAGraphExporter;
