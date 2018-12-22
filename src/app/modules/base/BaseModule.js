import GraphImporter from './GraphImporter.js';

const DEFAULT_PANELS = [];
const DEFAULT_EXPORTERS = [];

class BaseModule
{
  constructor()
  {
    this._importer = new GraphImporter(this);
  }

  initialize(app) {}

  destroy(app) {}

  getGraphImporter()
  {
    return this._importer;
  }

  getDefaultGraphExporter()
  {
    throw new Error("Missing default graph exporter for module \'" + this.getModuleName() + "\'");
  }

  getDefaultImageExporter()
  {
    throw new Error("Missing default image exporter for module \'" + this.getModuleName() + "\'");
  }

  getGraphExporters()
  {
    return DEFAULT_EXPORTERS;
  }

  getModuleTitlePanel()
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
