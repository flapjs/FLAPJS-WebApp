import GraphImporter from './exporter/GraphImporter.js';
import GraphImageExporter from './exporter/GraphImageExporter.js';

import { FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_SVG } from 'util/Downloader.js';

export const DEFAULT_GRAPH_EXPORTERS = [];
export const DEFAULT_IMAGE_EXPORTERS = [
  new GraphImageExporter(FILE_TYPE_PNG),
  new GraphImageExporter(FILE_TYPE_JPG),
  new GraphImageExporter(FILE_TYPE_SVG)
];

class AbstractGraphController
{
  constructor(module, graph, labeler, parser)
  {
    if (!module) throw new Error("Missing module for graph controller");
    if (!graph) throw new Error("Missing graph for graph controller");
    if (!labeler) throw new Error("Missing graph labeler for graph controller");
    if (!parser) throw new Error("Missing graph parser for graph controller");

    this._module = module;
    this._graph = graph;
    this._importer = new GraphImporter(module);
    this._labeler = labeler;
    this._parser = parser;
  }

  initialize(module) {}
  destroy(module) {}
  update(module) {}

  getDefaultGraphExporter()
  {
    const exporters = this.getGraphExporters();
    if (exporters.length > 0) return exporters[0];
    throw new Error("Missing default graph exporter for module \'" + this.getModule().getModuleName() + "\'");
  }
  getImageExporters() { return DEFAULT_IMAGE_EXPORTERS; }
  getGraphExporters() { return DEFAULT_GRAPH_EXPORTERS; }
  getGraphImporter() { return this._importer; }
  getGraphParser(type="JSON")
  {
    const parsers = this._parser;
    if (parsers && type in parsers)
    {
      return parsers[type];
    }
    else
    {
      throw new Error("Unsupported type for graph parser \'" + type + "\'");
    }
  }
  getGraphLabeler() { return this._labeler; }
  getGraph() { return this._graph; }
  getModule() { return this._module; }
}

export default AbstractGraphController;
