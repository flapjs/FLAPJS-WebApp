import React from 'react';
import Style from './TestListView.css';

import { guid } from 'util/MathHelper.js';

import IconButton from 'experimental/components/IconButton.js';
import IconUploadButton from 'experimental/components/IconUploadButton.js';

import PageContentIcon from 'experimental/iconset/PageContentIcon.js';
import UploadIcon from 'experimental/iconset/UploadIcon.js';
import DownloadIcon from 'experimental/iconset/DownloadIcon.js';
import CrossIcon from 'experimental/iconset/CrossIcon.js';
import AddIcon from 'experimental/iconset/AddIcon.js';

import TestItem, {SUCCESS_MODE, FAILURE_MODE, DEFAULT_MODE} from './TestItem.js';

const ACCEPT_FILE_TYPES = ['txt'];

class TestListView extends React.Component
{
  constructor(props)
  {
    super(props);

    this._testList = [];

    this.onTestNew = this.onTestNew.bind(this);
    this.onTestUpload = this.onTestUpload.bind(this);
    this.onTestDownload = this.onTestDownload.bind(this);
    this.onTestClose = this.onTestClose.bind(this);
    this.onTestAdd = this.onTestAdd.bind(this);
    this.onTestDelete = this.onTestDelete.bind(this);
    this.onTestTest = this.onTestTest.bind(this);
  }

  onTestNew(e)
  {
    if (!this.isEmpty())
    {
      this.onTestClose(e);
    }

    this.onTestAdd(e);
  }

  onTestUpload(fileBlob)
  {

  }

  onTestDownload(e)
  {

  }

  onTestClose(e)
  {
    this._testList.length = 0;
  }

  onTestAdd(e)
  {
    this._testList.push(guid());
  }

  onTestDelete(e, item)
  {
    const i = this._testList.indexOf(item.props.name);
    if (i >= 0)
    {
      this._testList.splice(i, 1);
    }
  }

  onTestTest(e, item)
  {
    item.setState({status: SUCCESS_MODE});
  }

  isEmpty()
  {
    return this._testList.length <= 0;
  }

  //Override
  render()
  {
    const empty = this.isEmpty();

    return (
      <div id={this.props.id}
        className={Style.test_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.test_control_tray}>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.new")}
            onClick={this.onTestNew}>
            <PageContentIcon/>
          </IconButton>
          <IconUploadButton className={Style.test_control_button}
            title={I18N.toString("action.testing.import")}
            accept={ACCEPT_FILE_TYPES.join(",")}
            onUpload={this.onTestUpload}>
            <UploadIcon/>
          </IconUploadButton>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.save")}
            onClick={this.onTestDownload}>
            <DownloadIcon/>
          </IconButton>
          <IconButton className={Style.test_control_button}
            title={I18N.toString("action.testing.clear")}
            disabled={empty}
            onClick={this.onTestClose}>
            <CrossIcon/>
          </IconButton>
        </div>
        <div className={Style.test_list_container +
          (empty ? " empty " : "")}>
          <IconButton className={Style.test_list_add}
            title={"Add"} onClick={this.onTestAdd}>
            <AddIcon/>
            <span className={Style.test_list_count}>
              {!empty ? "" + this._testList.length : ""}
            </span>
          </IconButton>
          <div className={Style.test_list_scroll_container}>
            <div className={Style.test_list}>
              {this._testList.map((e, i) =>
                <TestItem key={e} name={e}
                  onTest={this.onTestTest}
                  onDelete={this.onTestDelete}/>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TestListView;
