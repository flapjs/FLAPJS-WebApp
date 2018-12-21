import GraphExporter from 'modules/base/exporter/GraphExporter.js';

import XMLIcon from 'icons/flat/XMLIcon.js';
import * as FlapSaver from 'util/FlapSaver.js';
import { XML as XMLGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import Downloader from 'util/Downloader.js';

class JFLAPGraphExporter extends GraphExporter
{
  constructor() { super(); }

  //Override
  importFromFile(fileBlob, app)
  {
    throw new Error("Unsupported import for type \'" + this.getFileType() + "\'");
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
