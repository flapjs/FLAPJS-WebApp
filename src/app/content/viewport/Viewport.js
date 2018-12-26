import React from 'react';
import './Viewport.css';

const VIEWPORT_RENDER_LAYER = "viewport";

class Viewport extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
    this.labelEditor = null;

    this.state = {
      prevMode: Viewport.NORMAL,
      mode: Viewport.NORMAL
    };
  }

  //Override
  render()
  {
    const app = this.props.app;
    const currentModule = app.getCurrentModule();
    const inputController = app.getInputController();
    const graphController = app.getGraphController();
    const machineController = app.getMachineController();

    const ViewportRenderer = currentModule.getRenderer(VIEWPORT_RENDER_LAYER);

    return <div className={"viewport-container viewport-" + this.state.mode} ref={ref=>this.ref=ref}>
      { ViewportRenderer &&
        <ViewportRenderer {...this.props} parent={this}/>}
    </div>;
  }
}
Viewport.NORMAL = "normal";
Viewport.WAITING = "waiting";
Viewport.TESTING = "testing";
Viewport.DANGEROUS = "dangerous";

export default Viewport;
