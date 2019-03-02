import React from 'react';

import SelectionBoxRenderer from 'experimental/renderer/SelectionBoxRenderer.js';
import HighlightRenderer from 'experimental/renderer/HighlightRenderer.js';

class FSAGraphOverlayRenderer extends React.Component
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
    const selectionBox = inputController.getSelectionBox();
    const selectionBoundingBox = selectionBox.getSelectionBox();

    return (
      <g>
        {/* Selected elements */}
        { selectionBox &&
          selectionBox.hasSelection() &&
          selectionBox.getSelection(graph).map((e, i) =>
            <HighlightRenderer key={e.getGraphElementID()}
              className={inputController.isTrashMode() ?
                "highlight-error" :
                "highlight-select"}
              target={e} type="node"/>) }

        {/* Selection box */}
        { selectionBoundingBox &&
          <SelectionBoxRenderer visible={selectionBoundingBox.visible}
            fromX={selectionBoundingBox.fromX} fromY={selectionBoundingBox.fromY}
            toX={selectionBoundingBox.toX} toY={selectionBoundingBox.toY}/> }

        {/* Node test targets */}
        { currentModule._tester.targets && currentModule._tester.targets.map((e, i) => {
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

export default FSAGraphOverlayRenderer;
