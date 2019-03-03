const MODULE_NAME = "empty";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "Empty";

class EmptyModule
{
  constructor(app)
  {
    this._app = app;
  }

  //Override
  initialize(app)
  {
  }

  //Override
  update(app)
  {
  }

  //Override
  destroy(app)
  {
  }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

  getApp() { return this._app; }
}

export default EmptyModule;
