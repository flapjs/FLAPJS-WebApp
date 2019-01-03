import AbstractGraphExporter from 'modules/abstract/exporter/AbstractGraphExporter.js';

import JSONFileIcon from 'icons/flat/JSONIcon.js';
import { JSON as JSONGraphParser } from 'graph/parser/NodalGraphParser.js';
import Downloader from 'util/Downloader.js';

class DefaultGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  fromJSON(data, module)
  {
    const graphController = module.getGraphController();
    const graph = graphController.getGraph();

    const metadata = '_metadata' in data ? data['_metadata'] : {};
    const newGraph = JSONGraphParser.parse(data.graphData, graph);
    return newGraph;
  }

  toJSON(graphData, module)
  {
    const graphController = module.getGraphController();

    const dst = {};
    dst["_metadata"] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    dst["graphData"] = graphData;
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
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const graph = graphController.getGraph();

        //TODO: this should not be here, this should exist somewhere in graphController
        graphController.emit("userPreImportGraph", graph);

        try
        {
          const jsonData = JSON.parse(data);

          this.fromJSON(jsonData, module);

          graphController.emit("userImportGraph", graph);

          resolve();
        }
        catch (e)
        {
          reader.abort();
          reject(e);
        }
        finally
        {
          graphController.emit("userPostImportGraph", graph);
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
    Downloader.downloadText(filename + '.' + this.getFileType(), jsonString);
  }

  //Override
  doesSupportData() { return true; }
  //Override
  doesSupportFile() { return true; }
  //Override
  canImport() { return true; }
  //Override
  getTitle() { return "Save machine to JSON"; }
  //Override
  getLabel() { return "Save machine to JSON"; }
  //Override
  getFileType() { return "json"; }
  //Override
  getIconClass() { return JSONFileIcon; }
}

export default DefaultGraphExporter;
