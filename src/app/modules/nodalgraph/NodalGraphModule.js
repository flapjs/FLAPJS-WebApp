import React from 'react';

import PanelContainer from 'experimental/panels/PanelContainer.js';

const MODULE_NAME = "nodalgraph";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "NodalGraph";

class NodalGraphModule
{
  constructor(app)
  {
    this._app = app;

    app.getDrawerManager()
      .addPanelClass(props => (
        <PanelContainer title={"Your Average Graph Editor"}>
          <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
          <p>{"<- Tap on a tab to begin!"}</p>
        </PanelContainer>
      ));
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

export default NodalGraphModule;
