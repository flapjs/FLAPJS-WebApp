import React from 'react';
import './TestTray.css';

import IconButton from 'icons/IconButton.js';
import PlayIcon from 'icons/PlayIcon.js';
import PauseIcon from 'icons/PauseIcon.js';
import TestMode from './TestMode.js'
import UndoIcon from 'icons/UndoIcon.js';
import RedoIcon from 'icons/RedoIcon.js';

class TestTray extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const tester = this.props.tester;
    const testInput = tester.getCurrentTestInput();
    const testIndex = tester.testMode.getCurrentTestStringIndex();

    return <div className="anchor-bottom-left test-tray-container">
      <IconButton onClick={(e)=>{tester.testMode.onResume();}}>
        <PlayIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onPause();
      }}>
        <PauseIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onPreviousStep();
      }}>
        <UndoIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onNextStep();
      }}>
        <RedoIcon/>
      </IconButton>

      <span className="test-tray-input-string-container">
      {
        testInput && testIndex >= 0 &&
        testInput.value.split('').map((e, i) => {
          if (testIndex - i > 3) return <span key={i}></span>;
          if (testIndex - i < -3) return <span key={i}></span>;
          return <span key={e + "." + i}
            className={"test-tray-input-char" +
            (testIndex == i ? " active" : "")}>
            {e}
            </span>;
        })
      }
      </span>
    </div>;
  }
}

export default TestTray;
