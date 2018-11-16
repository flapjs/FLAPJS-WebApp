import Config from 'config.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

class DragStopHandler
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;
  }

  onEvent()
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    picker.updateTarget(x, y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //If stopped dragging a node...
      if (targetType === 'node')
      {
        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
          //If there exists selected states, delete them all!
          if (picker.hasSelection())
          {
            graphController.deleteSelectedNodes(target);
          }
          else
          {
            //Delete a single node
            graphController.deleteTargetNode(target);
          }

          return true;
        }
        //If dragged to an empty space (not trash)
        else
        {
          //Do nothing, since should have moved to position
          if (picker.hasSelection())
          {
            const dx = x - graphController.prevX;
            const dy = y - graphController.prevY;
            graphController.emit("nodeMoveAll", picker.getSelection(), dx, dy);
          }
          else
          {
            graphController.emit("nodeMove", target, x, y, graphController.prevX, graphController.prevY);
          }
          return true;
        }
      }
      //If stopped dragging a edge...
      else if (targetType === 'edge')
      {
        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
          graphController.deleteTargetEdge(target);
        }
        else
        {
          //Do nothing, since should have moved to position
          graphController.emit("edgeMove", target, target.getQuadratic(), graphController.prevQuad);
        }
        return true;
      }
      //If stopped dragging a endpoint...
      else if (targetType === 'endpoint')
      {
        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
          graphController.deleteTargetEdge(target);
          return true;
        }
        //If hovering over a node...
        else if (target.to instanceof Node)
        {
          const targetNode = target.to;

          //TODO: this is the same in graph.newEdge
          //Look for an existing edge with similar from and to
          for(const edge of graphController.graph.edges)
          {
            if (edge !== target && edge.from === target.from && picker.isTarget(edge.to))
            {
              let result = edge.label.split(",");
              if (target.label !== Config.STR_TRANSITION_DEFAULT_LABEL)
              {
                result = result.concat(target.label.split(","));
              }

              //Allow the user to edit the merged labels
              graphController.openLabelEditor(edge, x, y, result.join(","), false);

              //Delete the merged label
              graphController.graph.deleteEdge(target);
              return true;
            }
          }

          //If the edge has changed...
          if (graphController.prevEdgeTo !== null)
          {
            //Make sure that it's previous edge was not null
            target._to = graphController.prevEdgeTo;
            //Finalize the edge (trigger the event)
            target.to = targetNode;
          }

          //If the cursor returns to the state after leaving it...
          if (target.isSelfLoop())
          {
            //Make it a self loop
            const dx = target.from.x - x;
            const dy = target.from.y - y;
            const angle = Math.atan2(dy, dx);
            target.makeSelfLoop(angle);
          }
          //Otherwise, maintain original curve
          else
          {
            let flag = false;
            const x1 = target.from.x;
            const y1 = target.from.y;
            const x2 = target.to.x;
            const y2 = target.to.y;
            const dist12sq = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
            let vertical = false;
            let m = 0;
            let b = 0;
            if(x1 > x2) {
              m = (y1-y2) / (x1-x2);
              b = y2-m*x2;
            } else if (x1 < x2) {
              m = (y2-y1) / (x2-x1);
              b = y1-m*x1;
            } else {
              vertical = true;
            }

            for(const node of graphController.graph.nodes)
            {
              if(node === target.from || node === target.to) continue;

              const x0 = node.x;
              const y0 = node.y;

              const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
              const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
              if(dist01sq > dist12sq || dist02sq > dist12sq) continue;

              let dist = 0;
              if(vertical) {
                dist = Math.abs(x1-x0);
              } else {
                dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
              }

              if(dist < Config.NODE_RADIUS) {
                flag = true;
                break;
              }
            }

            if (flag)
            {
              target.setQuadVector(-Math.PI / 2, Config.NODE_RADIUS + 10);
            }
            else
            {
              target.copyQuadraticsFrom(graphController.prevQuad);
            }
          }

          if (inputController.isNewEdge)
          {
            //Moved below to allow openLabelEditor to check it...
            //inputController.isNewEdge = false;

            //Emit event
            graphController.emit("userCreateEdge", graphController.graph, target);
          }
          else if (graphController.prevEdgeTo !== null)
          {
            //Emit event
            graphController.emit("edgeDestination", target, target.to, graphController.prevEdgeTo, graphController.prevQuad);
          }

          //TODO: this is the same in graph.newEdge
          //Bend away if there is another edge not bent with the same src/dst
          for(const edge of graphController.graph.edges)
          {
            if (edge.isQuadratic()) continue;
            if ((edge.to === target.from && edge.from === target.to))
            {
              const HALFPI = Math.PI / 2;
              target.setQuadVector(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
              edge.setQuadVector(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
            }
          }

          //Open label editor if default edge...
          if (target.label === Config.STR_TRANSITION_DEFAULT_LABEL)
          {
            if (inputController.isNewEdge)
            {
              graphController.openLabelEditor(target, x, y, null, true, () => {
                graphController.emit("userPostCreateEdge", graphController.graph, target);
              });
            }
            else
            {
              graphController.openLabelEditor(target, x, y);
            }
          }

          //Moved from userCreateEdge event emit to here to allow openLabelEditor to check it
          inputController.isNewEdge = false;

          return true;
        }
        //If hovering over anything else...
        else
        {
          //Destroy any edge that no longer have a destination
          if (inputController.shouldDestroyPointlessEdges)
          {
            graphController.graph.deleteEdge(target);
            return true;
          }
          //Keep edges as placeholders (used in DFA's)
          else
          {
            target.makePlaceholder();

            //Open label editor if default edge...
            if (target.label === Config.STR_TRANSITION_DEFAULT_LABEL)
            {
              graphController.openLabelEditor(target, x, y);
            }
            return true;
          }
        }
      }
      else if (targetType === 'initial')
      {
        //If valid initial object to mark...
        if (inputController.ghostInitialMarker instanceof Node)
        {
          const prevInitial = graphController.graph.getStartNode();

          //Set the new object as the initial node
          graphController.graph.setStartNode(inputController.ghostInitialMarker);

          //Emit event
          graphController.emit("nodeInitial", inputController.ghostInitialMarker, prevInitial);
        }

        //Reset ghost initial marker
        inputController.ghostInitialMarker = null;
        return true;
      }
      else if (targetType === 'none')
      {
        //Do nothing. It should already be moved.
        return true;
      }
      else
      {
        //All move drag should be handled
        throw new Error("Unknown target type \'" + targetType + "\'.");
      }
    }
    //If is NOT in move mode...
    else
    {
      //If was trying to select...
      if (picker.isSelecting())
      {
        //Stop selecting stuff, fool.
        picker.endSelection(x, y);
        return true;
      }
    }

    return false;
  }
}

export default DragStopHandler;
