import GraphImporter from './exporter/GraphImporter.js';
import GraphImageExporter from './exporter/GraphImageExporter.js';

import ExportingPanel from './panels/exporting/ExportingPanel.js';
import OptionsPanel from './panels/options/OptionsPanel.js';

const DEFAULT_GRAPH_EXPORTERS = [];
const DEFAULT_IMAGE_EXPORTERS = [
  new GraphImageExporter('png'),
  new GraphImageExporter('jpg')
];

export const DEFAULT_PANELS = [ExportingPanel, OptionsPanel];

class AbstractModule
{
  constructor(app)
  {
    this._importer = new GraphImporter(this);
  }

  initialize(app) {}

  destroy(app) {}

  update(app) {}

  getRenderer(renderLayer) { return null; }
  getInputController() { throw new Error("Missing input controller for module \'" + this.getModuleName() + "\'"); }
  getGraphController() { throw new Error("Missing graph controller for module \'" + this.getModuleName() + "\'"); }
  getMachineController() { throw new Error("Missing machine controller for module \'" + this.getModuleName() + "\'"); }
  getDefaultGraphExporter()
  {
    const exporters = this.getGraphExporters();
    if (exporters.length > 0) return exporters[0];

    throw new Error("Missing default graph exporter for module \'" + this.getModuleName() + "\'");
  }
  getImageExporters() { return DEFAULT_IMAGE_EXPORTERS; }
  getGraphExporters() { return DEFAULT_GRAPH_EXPORTERS; }
  getGraphImporter() { return this._importer; }
  getModulePanels() { return DEFAULT_PANELS; }
  getModuleVersion() { return '0.0.0'; }
  getModuleName() { throw new Error("Missing module name"); }
  getLocalizedModuleName() { return "Module"; }
}

export default AbstractModule;
