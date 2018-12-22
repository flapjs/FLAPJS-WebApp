import GraphExporter from 'modules/base/exporter/GraphExporter.js';

import JSONIcon from 'icons/flat/JSONIcon.js';
import * as FlapSaver from 'util/FlapSaver.js';
import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import Downloader from 'util/Downloader.js';

class FSAGraphExporter extends GraphExporter
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
          FlapSaver.loadFromJSON(jsonData, JSONGraphParser, app.graphController, app.machineController);

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

    /*
    result['_metadata'] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    */

    const jsonString = JSON.stringify(FlapSaver.saveToJSON(graphData, app.graphController, app.machineController));
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
