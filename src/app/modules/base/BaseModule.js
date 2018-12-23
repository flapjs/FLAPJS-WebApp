import GraphImporter from './exporter/GraphImporter.js';
import GraphImageExporter from './exporter/GraphImageExporter.js';

const DEFAULT_PANELS = [];
const DEFAULT_GRAPH_EXPORTERS = [];
const DEFAULT_IMAGE_EXPORTERS = [
  new GraphImageExporter('png'),
  new GraphImageExporter('jpg')
];

class BaseModule
{
  constructor()
  {
    this._importer = new GraphImporter(this);
  }

  initialize(app) {}

  destroy(app) {}

  getInputController()
  {
    throw new Error("Missing input controller for module \'" + this.getModuleName() + "\'");
  }

  getGraphController()
  {
    throw new Error("Missing graph controller for module \'" + this.getModuleName() + "\'");
  }

  getMachineController()
  {
    throw new Error("Missing machine controller for module \'" + this.getModuleName() + "\'");
  }

  getDefaultGraphExporter()
  {
    const exporters = this.getGraphExporters();
    if (exporters.length >= 0) return exporters[0];

    throw new Error("Missing default graph exporter for module \'" + this.getModuleName() + "\'");
  }

  getImageExporters()
  {
    return DEFAULT_IMAGE_EXPORTERS;
  }

  getGraphExporters()
  {
    return DEFAULT_GRAPH_EXPORTERS;
  }

  getGraphImporter()
  {
    return this._importer;
  }

  getGraphRenderer()
  {
    throw new Error("Missing graph renderer for module \'" + this.getModuleName() + "\'");
  }

  getDefaultModulePanel()
  {
    return null;
  }

  getModulePanels()
  {
    return DEFAULT_PANELS;
  }

  getModuleVersion()
  {
    return '0.0.0';
  }

  getModuleName()
  {
    throw new Error("Missing module name");
  }
}

export default BaseModule;
