import React from 'react';
import Style from './TapeWidget.css';

import DownArrowIcon from 'experimental/iconset/DownArrowIcon.js';

import TapeContext from './TapeContext.js';

const TAPE_INFINITE_LEFT = true;
const TAPE_INFINITE_RIGHT = true;

class TapeWidget extends React.Component
{
  constructor(props)
  {
    super(props);

    this.counter = 0;
    this.index = 0;

    this._tapeContext = new TapeContext("01001_");
  }

  //Override
  render()
  {
    if (++this.counter >= 100)
    {
      this.counter = 0;
      this.index += 1;
    }

    const showTransitionStates = true;

    return (
      <div id={this.props.id}
        className={"tape-row" +
        " " + this.props.className}
        style={this.props.style}>

        {TAPE_INFINITE_LEFT && this._tapeContext.isTapeLeftInfinite() &&
          <div className="tape-row-entry infinite">
            <span className="tape-row-states"></span>
            <label className="tape-row-symbol">{"..."}</label>
          </div>}

        <DownArrowIcon
          className="tape-pointer"
          style={{left: Math.floor((this.index - 1) / 2) + "em"}}/>

        {this._tapeContext.getTapeInput().map((e, i) => {
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

          const sourceStates = this._tapeContext.getTapeSourceStatesByIndex(i);
          return (
            <div key={e + ":" + i} className={"tape-row-entry" +
              (active ? " active " : "") +
              (activeRead ? " active-read " : "")}>
              {showTransitionStates &&
                <span className="tape-row-states">
                  {sourceStates.map(sourceState => {
                    return (
                      <label>{sourceState}</label>
                    );
                  })}
                </span>}
              <label className="tape-row-symbol">
                {e}
              </label>
            </div>
          );
        })}

        {TAPE_INFINITE_RIGHT && this._tapeContext.isTapeRightInfinite() &&
          <div className="tape-row-entry infinite">
            <span className="tape-row-states"></span>
            <label className="tape-row-symbol">{"..."}</label>
          </div>}
      </div>
    );
  }
}

export default TapeWidget;
