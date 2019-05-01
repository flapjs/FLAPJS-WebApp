import React from 'react';

import SelectionBoxRenderer from './SelectionBoxRenderer.js';
import HighlightRenderer from './HighlightRenderer.js';

class GraphInputRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    //Inherits props from parent
    const currentModule = this.props.currentModule;

    const inputController = currentModule.getInputController();

    const viewport = inputController.getInputAdapter().getViewport();
    const picker = inputController.getPicker();
    const selectionBox = inputController.getSelectionBox();

    return (
      <g>
        <SelectionBoxRenderer currentModule={currentModule}/>

        {/* Node test targets */}
        { currentModule._tester &&
          currentModule._tester.targets &&
          currentModule._tester.targets.map((e, i) => {
            return <HighlightRenderer key={e.getGraphElementID()}
              className="highlight-test graph-gui"
              target={e} type="node" offset="6"/>;
          })}

        {/* Hover markers */}
        { picker &&
          picker.hasTarget() &&
          !selectionBox.isTargetInSelection(picker.target) &&
          <HighlightRenderer className={inputController.isTrashMode() ?
            "highlight-error" :
            "highlight-select"}
            target={picker.target}
            type={picker.targetType}/> }
      </g>
    );
  }
}

export default GraphInputRenderer;
