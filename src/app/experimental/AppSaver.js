import AbstractLocalSaver from 'system/localsave/AbstractLocalSaver.js';
import LocalSave from 'system/localsave/LocalSave.js';

class AppSaver extends AbstractLocalSaver
{
  constructor(app)
  {
    super();

    this._app = app;
  }

  //Override
  onLoadSave()
  {
    const module = this._app.getCurrentModule();
    const moduleName = module.getModuleName();

    const data = LocalSave.loadFromStorage("graph-" + moduleName);
    if (data)
    {
      const exporter = module.getDefaultGraphExporter();
      exporter.importFromData(data, module);
    }

    //HACK: not all modules have this
    if (module.captureGraphEvent) module.captureGraphEvent();
  }

  //Override
  onUnloadSave()
  {
    //Don't do anything...
  }

  //Override
  onAutoSave()
  {
    const module = this._app.getCurrentModule();
    const moduleName = module.getModuleName();

    const exporter = module.getDefaultGraphExporter();
    const data = exporter.exportToData(module);
    LocalSave.saveToStorage("graph-" + moduleName, data);
  }

  getApp()
  {
    return this._app;
  }
}

export default AppSaver;
