class ExportManager
{
  constructor(app)
  {
    this._app = app;

    this._exporters = [];
  }

  addExporter(exporter)
  {
    this._exporters.push(exporter);
    return this;
  }

  addExporters(exporters)
  {
    for(const exporter of exporters)
    {
      this._exporters.push(exporter);
    }
    return this;
  }

  //DuckType(SessionListener)
  onSessionStart(session)
  {

  }

  //DuckType(SessionListener)
  onSessionStop(session)
  {
    this._exporters.length = 0;
  }

  tryImportFromFile(fileBlob)
  {
    if (!fileBlob) throw new Error("Unable to import null file");
    if (!(fileBlob instanceof File)) throw new Error("Unable to import object as file");

    const currentModule = this._app.getSession().getCurrentModule();
    let result = Promise.reject();
    const fileName = fileBlob.name;
    const exporters = this._exporters;

    for(const exporter of exporters)
    {
      if (exporter.canImport() && exporter.doesSupportFile() && fileName.endsWith(exporter.getFileType()))
      {
        result = result.catch(e => exporter.importFromFile(fileBlob, currentModule));
      }
    }

    return result.catch(e => {
      console.error(e);
      throw new Error("Cannot find valid exporter for file: " + fileName);
    });
  }

  tryExportToFile(exporter=null)
  {
    const currentModule = this._app.getSession().getCurrentModule();
    const machineController = currentModule.getMachineController();
    const fileName = machineController.getMachineName();
    if (!exporter) exporter = this.getDefaultExporter();
    exporter.exportToFile(fileName, currentModule)
  }

  getImportFileTypes()
  {
    return this._exporters.map(e => {
      if (!e.canImport() || !e.doesSupportFile()) return null;
      return '.' + e.getFileType();
    });
  }

  getDefaultExporter()
  {
    return this._exporters[0];
  }

  getExporters()
  {
    return this._exporters;
  }
}

export default ExportManager;
