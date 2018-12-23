import AbstractGraphExporter from 'modules/base/exporter/AbstractGraphExporter.js';

import XMLIcon from 'icons/flat/XMLIcon.js';
import { XML as XMLGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import Downloader from 'util/Downloader.js';

class JFLAPGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

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
          const xmlData = new DOMParser().parseFromString(data, "text/xml");
          XMLGraphParser.parse(xmlData, graph);

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
    const graphData = XMLGraphParser.objectify(graph);
    const xmlString = new XMLSerializer().serializeToString(graphData);
    Downloader.downloadText(filename + '.' + this.getFileType(), xmlString);
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
    return I18N.toString("file.export.jff.hint");
  }

  //Override
  getLabel()
  {
    return I18N.toString("file.export.jff");
  }

  //Override
  getFileType()
  {
    return "jff";
  }

  //Override
  getIconComponentClass()
  {
    return XMLIcon;
  }
}

export default JFLAPGraphExporter;
