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
      <IconButton onClick={(e)=>{tester.testMode.onResume();}} disabled={tester.testMode.isRunning()}>
        <PlayIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onPause();
      }} disabled={!tester.testMode.isRunning()}>
        <PauseIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onPreviousStep();
      }} disabled={!tester.testMode.hasPrevStep()}>
        <UndoIcon/>
      </IconButton>

      <IconButton onClick = {(e)=>{
        tester.testMode.onNextStep();
      }} disabled={!tester.testMode.hasNextStep()}>
        <RedoIcon/>
      </IconButton>

      <span className="test-tray-input-string-container">
      {
        testInput && testIndex >= 0 &&
        testInput.value.split('').map((e, i) => {
          const testOffset = testIndex - i;
          if (testOffset > 6 || testOffset < -6) return;
          if (testOffset > 3 || testOffset < -3)
          {
            return <span key={e + "." + i} className="test-tray-input-placeholder">.</span>;
          }
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
