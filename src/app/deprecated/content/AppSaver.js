import AbstractLocalSaver from 'deprecated/system/localsave/AbstractLocalSaver.js';
import LocalSave from 'deprecated/system/localsave/LocalSave.js';

class AppSaver extends AbstractLocalSaver
{
  constructor(app)
  {
    super();

    this._app = app;
  }

  /** @override */
  onLoadSave()
  {
    const module = this._app.getCurrentModule();
    const moduleName = module.getModuleName();

    const data = LocalSave.loadFromStorage("graph-" + moduleName);
    if (data)
    {
      const exporter = module.getGraphController().getDefaultGraphExporter();
      exporter.importFromData(data, module);
    }

    //HACK: not all modules have this
    if (module.captureGraphEvent) module.captureGraphEvent();
  }

  /** @override */
  onUnloadSave()
  {
    //Don't do anything...
  }

  /** @override */
  onAutoSave()
  {
    const module = this._app.getCurrentModule();
    const moduleName = module.getModuleName();

    const exporter = module.getGraphController().getDefaultGraphExporter();
    const data = exporter.exportToData(module);
    LocalSave.saveToStorage("graph-" + moduleName, data);
  }

  getApp()
  {
    return this._app;
  }
}

export default AppSaver;
