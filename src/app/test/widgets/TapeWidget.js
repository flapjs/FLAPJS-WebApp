import React from 'react';
import Style from './TapeWidget.css';

import DownArrowIcon from 'test/iconset/DownArrowIcon.js';

const TAPE_INFINITE_LEFT = false;
const TAPE_INFINITE_RIGHT = false;

class TapeWidget extends React.Component
{
  constructor(props)
  {
    super(props);

    this.inputs = "0129389472637892012u93________".split('');

    this.counter = 0;
    this.index = 0;
  }
  /*

    <div id={this.props.id}
      className={this.props.className}
      style={this.props.style}>
    </div>;
  */
  //Override
  render()
  {
    if (++this.counter >= 100)
    {
      this.counter = 0;
      this.index += 1;
    }

    return (
      <div id={this.props.id}
        className={"tape-row" +
        " " + this.props.className}
        style={this.props.style}>

        {/*MUST BE BEFORE POINTER*/
          TAPE_INFINITE_LEFT &&
          <div className="tape-row-entry infinite">
            <span className="tape-row-states"></span>
            <label className="tape-row-symbol">{"..."}</label>
          </div>}

        <DownArrowIcon className="tape-pointer" style={{left: Math.floor((this.index - 1) / 2) + "em"}}/>

        {this.inputs.map((e, i) => {
          let active = false;
          let activeRead = false;
          const currentIndex = Math.floor(this.index / 2);
          if (currentIndex === i)
          {
            //It's the current index...
            active = this.index % 2 === 1;
            activeRead = this.index % 2 === 0;
          }
          else if (currentIndex === i + 1)
          {
            //It's the previous index...
            active = this.index % 2 === 0;
          }

          return <div className={"tape-row-entry" + (active ? " active " : "") + (activeRead ? " active-read " : "")}>
            <span className="tape-row-states">
              <label>{"q0"}</label>
              <label>{"q1"}</label>
              <label>{"q2"}</label>
              <label>{"q3"}</label>
              <label>{"q4"}</label>
              {i > 2 && <label>{"q5"}</label>}
            </span>
            <label className="tape-row-symbol">{e}</label>
          </div>;
        })}

        {TAPE_INFINITE_RIGHT &&
          <div className="tape-row-entry infinite">
            <span className="tape-row-states"></span>
            <label className="tape-row-symbol">{"..."}</label>
          </div>}
      </div>
    );
  }
}

export default TapeWidget;
