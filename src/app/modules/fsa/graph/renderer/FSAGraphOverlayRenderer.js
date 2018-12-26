import React from 'react';

import SelectionBoxRenderer from 'content/workspace/renderer/SelectionBoxRenderer.js';
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

    const currentModule = app.getCurrentModule();
    const graphController = app.getGraphController();
    const inputController = app.getInputController();
    const machineController = app.getMachineController();
    const tester = currentModule.getTestingManager();

    const graph = graphController.getGraph();
    const viewport = inputController.getInputAdapter().getViewport();
    const machineBuilder = machineController.getMachineBuilder();
    const picker = inputController.getPicker();
    const selectionBox = picker.getSelectionBox();

    return <g>
      {/* Selected elements */}
      { picker.hasSelection() &&
        picker.getSelection(graph).map((e, i) =>
          <HighlightRenderer key={e.getGraphElementID()} className={inputController.isTrashMode() ? "highlight-error" : "highlight-select"} target={e} type="node"/>) }

      {/* Selection box */}
      <SelectionBoxRenderer visible={selectionBox.visible}
        fromX={selectionBox.fromX} fromY={selectionBox.fromY}
        toX={selectionBox.toX} toY={selectionBox.toY}/>

      {/* Node warning targets */}
      { machineController.getMachineBuilder().machineErrorChecker.warningNodes.map((e, i) =>
        <HighlightRenderer key={e.getGraphElementID()} className="highlight-warning graph-gui" target={e} type="node" offset="6"/>) }

      {/* Edge warning targets */}
      { machineController.getMachineBuilder().machineErrorChecker.warningEdges.map((e, i) =>
        <HighlightRenderer key={e.getGraphElementID()} className="highlight-warning graph-gui" target={e} type="edge" offset="6"/>) }

      {/* Node error targets */}
      { machineController.getMachineBuilder().machineErrorChecker.errorNodes.map((e, i) =>
        <HighlightRenderer key={e.getGraphElementID()} className="highlight-error graph-gui" target={e} type="node" offset="6"/>) }

      {/* Edge error targets */}
      { machineController.getMachineBuilder().machineErrorChecker.errorEdges.map((e, i) =>
        <HighlightRenderer key={e.getGraphElementID()} className="highlight-error graph-gui" target={e} type="edge" offset="6"/>) }

      {/* Node test targets */}
      { tester.testMode.targets.map((e, i) => {
          return <HighlightRenderer key={e.getGraphElementID()} className="highlight-test graph-gui" target={e} type="node" offset="6"/>;
        }) }

      {/* Hover markers */}
      { picker.hasTarget() &&
        !picker.isTargetInSelection() &&
        <HighlightRenderer className={inputController.isTrashMode() ? "highlight-error" : "highlight-select"} target={picker.target} type={picker.targetType}/> }
    </g>;
  }
}

export default FSAGraphOverlayRenderer;
