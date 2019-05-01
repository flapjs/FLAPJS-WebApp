import AbstractAutoSaveHandler from 'util/storage/AbstractAutoSaveHandler.js';

class AppSaver extends AbstractAutoSaveHandler
{
  constructor(app)
  {
    super();

    this._app = app;
  }

  /** @override */
  onAutoSaveLoad(dataStorage)
  {
    const app = this._app;
    const session = app.getSession();
    const currentModule = session.getCurrentModule();
    const currentModuleName = currentModule.getModuleName();

    const data = dataStorage.getDataAsObject("graph-" + currentModuleName);
    if (data)
    {
      const exporter = app.getExportManager().getDefaultExporter();
      if (exporter)
      {
        exporter.importFromData(data, currentModule);

        app.getUndoManager().captureEvent();
      }
    }
  }

  /** @override */
  onAutoSaveUpdate(dataStorage)
  {
    const app = this._app;
    const session = app.getSession();
    const currentModule = session.getCurrentModule();
    const currentModuleName = currentModule.getModuleName();

    const exporter = app.getExportManager().getDefaultExporter();
    if (exporter)
    {
      const data = exporter.exportToData(currentModule);
      dataStorage.setDataAsObject("graph-" + currentModuleName, data);
    }
  }

  /** @override */
  onAutoSaveUnload(dataStorage)
  {
    //Don't do anything...
  }

  getApp() { return this._app; }
}

export default AppSaver;
