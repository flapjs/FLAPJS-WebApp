import React from 'react';
import Style from './TestItem.css';

import IconButton from 'experimental/components/IconButton.js';
import SubtractIcon from 'experimental/iconset/SubtractIcon.js';
import CheckCircleIcon from 'experimental/iconset/CheckCircleIcon.js';
import CrossCircleIcon from 'experimental/iconset/CrossCircleIcon.js';
import RunningManIcon from 'experimental/iconset/RunningManIcon.js';

export const DEFAULT_MODE = "default";
export const SUCCESS_MODE = "success";
export const FAILURE_MODE = "failure";
export const WORKING_MODE = "working";

class TestItem extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: "",
      status: WORKING_MODE
    };

    this.onTest = this.onTest.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onTest(e)
  {

  }

  onDelete(e)
  {

  }

  //Override
  render()
  {
    const status = this.state.status;
    return (
      <div id={this.props.id}
        className={Style.test_item_container +
          (this.props.active ? " active " : "") +
          " " + status +
          " " + this.props.className}
        style={this.props.style}>
        <IconButton className={Style.test_button}
          title={"Test"} onClick={this.onTest}>
          {status === SUCCESS_MODE ?
            <CheckCircleIcon/> :
            status === FAILURE_MODE ?
            <CrossCircleIcon/> :
            <RunningManIcon/>}
        </IconButton>
        <div className={Style.test_input}>
          <input type="text"/>
          <label>TEST INPUT</label>
        </div>
        <IconButton className={Style.delete_button}
          title={"Delete"} onClick={this.onDelete}>
          <SubtractIcon/>
        </IconButton>
      </div>
    );
  }
}

export default TestItem;
