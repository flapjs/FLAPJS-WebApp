import React from 'react';
import Style from './pane/PaneView.css';

import TapeWidget from './widgets/TapeWidget.js';

import ZoomWidget from './widgets/ZoomWidget.js';
import FocusCenterWidget from './widgets/FocusCenterWidget.js';
import IconStateButton from './components/IconStateButton.js';
import FullscreenIcon from './iconset/FullscreenIcon.js';
import FullscreenExitIcon from './iconset/FullscreenExitIcon.js';

class TapePane extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false
    };
  }

  //Override
  render()
  {
    const module = this.props.module;
    const viewport = this.props.viewport;
    const inputController = module.getInputController();
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();

    const isActive = this.props.active;

    return (
      <div id={this.props.id}
        className={Style.pane_container +
          (isActive ? " active " : "") +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.pane_widget} style={{right: 0}}>
          <IconStateButton onClick={(e, i) => app.setState({hide: (i === 0)})}>
            <FullscreenIcon/>
            <FullscreenExitIcon/>
          </IconStateButton>
          <ZoomWidget viewport={viewport}/>
          <FocusCenterWidget viewport={viewport}/>
        </div>
        <div className={Style.pane_widget} style={{bottom: 0}}>
          <TapeWidget/>
        </div>
      </div>
    );
  }
}

export default TapePane;
