import GraphExporter from 'modules/base/exporter/GraphExporter.js';

import JSONIcon from 'icons/flat/JSONIcon.js';
import * as FlapSaver from 'util/FlapSaver.js';
import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import Downloader from 'util/Downloader.js';

class DefaultGraphExporter extends GraphExporter
{
  constructor() { super(); }

  //Override
  importFromData(data, app)
  {
    FlapSaver.loadFromJSON(data, JSONGraphParser, app.graphController, app.machineController);
  }

  //Override
  exportToData(app)
  {
    const graph = app.graphController.getGraph();
    const graphData = JSONGraphParser.objectify(graph);
    const data = FlapSaver.saveToJSON(graphData, app.graphController, app.machineController);
    return data;
  }

  //Override
  doesSupportData()
  {
    return true;
  }

  //Override
  importFromFile(fileBlob, app)
  {

  }

  //Override
  exportToFile(filename, app)
  {
    const graph = app.graphController.getGraph();
    const graphData = JSONGraphParser.objectify(graph);

    /*
    result['_metadata'] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    */
    
    const jsonString = JSON.stringify(FlapSaver.saveToJSON(graphData, app.graphController, app.machineController));
    Downloader.downloadText(filename + '.' + this.getFileType(), jsonString);
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
    return "fsa.json";
  }

  //Override
  getIconComponentClass()
  {
    return JSONIcon;
  }
}

export default DefaultGraphExporter;
