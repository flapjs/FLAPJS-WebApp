import React from 'react';
import Style from './TestingPanel.css';

import IconButton from 'experimental/components/IconButton.js';
import IconUploadButton from 'experimental/components/IconUploadButton.js';

import PageContentIcon from 'experimental/iconset/PageContentIcon.js';
import UploadIcon from 'experimental/iconset/UploadIcon.js';
import DownloadIcon from 'experimental/iconset/DownloadIcon.js';
import CrossIcon from 'experimental/iconset/CrossIcon.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      noTestMode: true
    };

    this.onTestNew = this.onTestNew.bind(this);
    this.onTestUpload = this.onTestUpload.bind(this);
    this.onTestDownload = this.onTestDownload.bind(this);
    this.onTestClose = this.onTestClose.bind(this);
  }

  onTestNew()
  {

  }

  onTestUpload()
  {

  }

  onTestDownload()
  {

  }

  onTestClose()
  {

  }

  //Override
  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const machineBuilder = machineController.getMachineBuilder();

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{TestingPanel.TITLE}</h1>
        </div>
        <div className={Style.panel_content}>
          <div className={Style.test_control_tray}>
            <IconButton title={I18N.toString("action.testing.new")}
              onClick={this.onTestNew}>
              <PageContentIcon/>
            </IconButton>
            <IconUploadButton title={I18N.toString("action.testing.import")}>
              <UploadIcon/>
            </IconUploadButton>
            <IconButton title={I18N.toString("action.testing.save")}>
              <DownloadIcon/>
            </IconButton>
            <IconButton title={I18N.toString("action.testing.clear")}
              disabled={this.state.noTestMode}>
              <CrossIcon/>
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
