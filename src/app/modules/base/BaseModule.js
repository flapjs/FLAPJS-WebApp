const DEFAULT_PANELS = [];

class BaseModule
{
  constructor() {}

  initialize(app) {}

  destroy(app) {}

  getModulePanels()
  {
    return DEFAULT_PANELS;
  }

  getModuleName()
  {
    throw new Error("Missing module name");
  }
}

export default BaseModule;
