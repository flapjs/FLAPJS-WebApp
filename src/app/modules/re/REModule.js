import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

const MODULE_NAME = "re";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "RE";

class REModule
{
  constructor(app)
  {
    this._app = app;

    app.getDrawerManager()
      .addPanelClass(props => (
        <PanelContainer id={props.id}
          className={props.className}
          style={props.style}
          title={"Regular Expressions"}>
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
  //Override
  getApp() { return this._app; }
}

export default REModule;
