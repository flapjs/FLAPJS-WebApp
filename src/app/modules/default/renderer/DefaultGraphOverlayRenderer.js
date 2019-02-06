import React from 'react';

import SelectionBoxRenderer from 'experimental/renderer/SelectionBoxRenderer.js';
import HighlightRenderer from 'experimental/renderer/HighlightRenderer.js';

class DefaultGraphOverlayRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    //Inherits props from parent
    const parent = this.props.parent;
    const currentModule = this.props.currentModule;

    const graphController = currentModule.getGraphController();
    const inputController = currentModule.getInputController();
    const machineController = currentModule.getMachineController();

    const graph = graphController.getGraph();
    const viewport = inputController.getInputAdapter().getViewport();
    const machineBuilder = machineController.getMachineBuilder();
    const machineErrors = machineBuilder.getMachineErrors();
    const machineWarnings = machineBuilder.getMachineWarnings();
    const picker = inputController.getPicker();
    const selectionBox = picker.getSelectionBox();

    return (
      <g>
        {/* Selected elements */}
        { picker.hasSelection() &&
          picker.getSelection(graph).map((e, i) =>
            <HighlightRenderer key={e.getGraphElementID()}
              className={inputController.isTrashMode() ?
                "highlight-error" :
                "highlight-select"}
              target={e} type="node"/>) }

        {/* Selection box */}
        <SelectionBoxRenderer visible={selectionBox.visible}
          fromX={selectionBox.fromX} fromY={selectionBox.fromY}
          toX={selectionBox.toX} toY={selectionBox.toY}/>

        {/* Hover markers */}
        { picker.hasTarget() &&
          !picker.isTargetInSelection() &&
          <HighlightRenderer className={inputController.isTrashMode() ?
            "highlight-error" :
            "highlight-select"}
            target={picker.target}
            type={picker.targetType}/> }
      </g>
    );
  }
}

export default DefaultGraphOverlayRenderer;
