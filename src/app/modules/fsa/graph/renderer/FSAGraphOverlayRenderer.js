import React from 'react';

import HighlightRenderer from 'content/workspace/renderer/HighlightRenderer.js';

class FSAGraphOverlayRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const app = this.props.app;
    const module = app.getCurrentModule();
    const tester = module.getTestingManager();
    return <g>
      {/* Node test targets */}
      { tester.testMode.targets.map((e, i) => {
          return <HighlightRenderer key={e.getGraphElementID()} className="highlight-test graph-gui" target={e} type="node" offset="6"/>;
        }) }
    </g>;
  }
}

export default FSAGraphOverlayRenderer;
