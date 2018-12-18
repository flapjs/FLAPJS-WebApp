import BaseModule from 'modules/base/BaseModule.js';

const PANELS = [];

class RedBlackModule extends BaseModule
{
  constructor()
  {
    super();
  }

  //Override
  initialize(app)
  {
    super.initialize(app);
  }

  //Override
  destroy(app)
  {
    super.destroy(app);
  }

  //Override
  getModulePanels()
  {
    return PANELS;
  }

  //Override
  getModuleName()
  {
    return "redblack";
  }
}

export default RedBlackModule;
