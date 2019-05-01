import React from 'react';

import BoxRenderer from './BoxRenderer.js';
import HighlightRenderer from './HighlightRenderer.js';

class SelectionBoxRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    const currentModule = this.props.currentModule;

    const graphController = currentModule.getGraphController();
    const inputController = currentModule.getInputController();

    const graph = graphController.getGraph();
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
          <BoxRenderer visible={selectionBoundingBox.visible}
            fromX={selectionBoundingBox.fromX} fromY={selectionBoundingBox.fromY}
            toX={selectionBoundingBox.toX} toY={selectionBoundingBox.toY}/> }
      </g>
    );
  }
}

export default SelectionBoxRenderer;
