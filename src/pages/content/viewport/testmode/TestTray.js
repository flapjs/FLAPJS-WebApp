import React from 'react';

import PlayIcon from 'icons/PlayIcon.js';
import PauseIcon from 'icons/PauseIcon.js';
import TestMode from './TestMode.js'

class TestTray extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className="anchor-bottom-left">
      <PlayIcon/>
      <PauseIcon/>
    </div>;
  }
}

export default TestTray;
