import React from 'react';
import Router from 'router.js';

import App from 'content/App.js'
import Modules from 'modules/Modules.js';

const MODULE_LOAD_DELAY = 300;
let MODULE_LOADING = false;
let MODULE_TIMEOUT = null;
let IS_DEFAULT_MODULE = true;

class ModuleLoader extends React.Component
{
  constructor(props)
  {
    super(props);

    this._timeout = null;
  }

  static loadModule(moduleID)
  {
    const moduleInfo = Modules[moduleID];
    if (!moduleInfo)
    {
      window.alert("Cannot find module with id \'" + moduleID + "\'");
      return;
    }

    //Overwrite any past calls...
    if (MODULE_TIMEOUT) clearTimeout(MODULE_TIMEOUT);

    MODULE_TIMEOUT = setTimeout(() => {
      moduleInfo.fetch((moduleClass) => {
        MODULE_TIMEOUT = null;
        IS_DEFAULT_MODULE = false;
        Router.routeTo(ModuleLoader, {moduleClass: moduleClass});
      });
    }, MODULE_LOAD_DELAY);
  }

  static isDefaultModule()
  {
    return IS_DEFAULT_MODULE;
  }

  static isModuleLoading()
  {
    return MODULE_TIMEOUT !== null;
  }

  //Override
  componentDidMount()
  {
    MODULE_TIMEOUT = setTimeout(() => {
      MODULE_TIMEOUT = null;
      Router.routeTo(App, {moduleClass: this.props.moduleClass});
    }, MODULE_LOAD_DELAY);
  }

  //Override
  render()
  {
    return (<div></div>);
  }
}

export default ModuleLoader;
