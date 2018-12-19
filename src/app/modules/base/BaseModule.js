const DEFAULT_PANELS = [];

class BaseModule
{
  constructor() {}

  initialize(app) {}

  destroy(app) {}

  getModuleTitlePanel()
  {
    return null;
  }

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
