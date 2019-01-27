import DefaultModule from 'modules/default/DefaultModule.js';

class DFSModule extends DefaultModule
{
  constructor(app)
  {
    super(app);
  }

  //Override
  getModuleName() { return "dfs"; }
  //Override
  getLocalizedModuleName() { return "Depth-First Search"; }
}

export default DFSModule;
