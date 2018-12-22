const DEFAULT_PANELS = [];
const DEFAULT_EXPORTERS = [];

class BaseModule
{
  constructor() {}

  initialize(app) {}

  destroy(app) {}

  tryImportFromFile(fileBlob, app)
  {
    if (!fileBlob) throw new Error("Unable to import null file");
    if (!(fileBlob instanceof File)) throw new Error("Unable to import object as file");

    let result = Promise.reject();
    const fileName = fileBlob.name;
    const exporters = this.getGraphExporters();

    for(const exporter of exporters)
    {
      if (exporter.canImport() && exporter.doesSupportFile() && fileName.endsWith(exporter.getFileType()))
      {
        result = result.catch(e => exporter.importFromFile(fileBlob, app));
      }
    }

    return result.catch(e => {
      throw new Error("Cannot find valid exporter for file: " + fileName);
    });
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
