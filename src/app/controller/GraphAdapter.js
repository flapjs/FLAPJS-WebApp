import Config from 'config.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

import CreateNodeHandler from './handlers/CreateNodeHandler.js';
import AcceptNodeHandler from './handlers/AcceptNodeHandler.js';
import TrashModeHandler from './handlers/TrashModeHandler.js';
import EditLabelHandler from './handlers/EditLabelHandler.js';

class GraphAdapter
{
  constructor(controller)
  {
    this.controller = controller;
    this.inputController = null;

    this.prevOffsetX = 0;
    this.prevOffsetY = 0;

    //Make sure this is always false when moving endpoints
    this.isNewEdge = false;

    this.firstEmptyClick = false;
    this.firstEmptyTime = 0;
    this.firstEmptyX = 0;
    this.firstEmptyY = 0;
    this.ghostInitialMarker = null;

    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;

    this.createNodeHandler = new CreateNodeHandler(this.controller);
    this.acceptNodeHandler = new AcceptNodeHandler(this.controller);
    this.trashModeHandler = new TrashModeHandler(this.controller);
    this.editLabelHandler = new EditLabelHandler(this.controller);

    this.onInputDown = this.onInputDown.bind(this);
    this.onInputMove = this.onInputMove.bind(this);
    this.onInputUp = this.onInputUp.bind(this);
    this.onInputAction = this.onInputAction.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  initialize(app)
  {
    this.inputController = app.inputController;

    this.inputController.on("inputdown", this.onInputDown);
    this.inputController.on("inputmove", this.onInputMove);
    this.inputController.on("inputup", this.onInputUp);
    this.inputController.on("inputaction", this.onInputAction);
    this.inputController.on("dragstart", this.onDragStart);
    this.inputController.on("dragmove", this.onDragMove);
    this.inputController.on("dragstop", this.onDragStop);
  }

  destroy()
  {
    this.inputController.removeEventListener("inputdown", this.onInputDown);
    this.inputController.removeEventListener("inputmove", this.onInputMove);
    this.inputController.removeEventListener("inputup", this.onInputUp);
    this.inputController.removeEventListener("inputaction", this.onInputAction);
    this.inputController.removeEventListener("dragstart", this.onDragStart);
    this.inputController.removeEventListener("dragmove", this.onDragMove);
    this.inputController.removeEventListener("dragstop", this.onDragStop);
  }

  onInputDown(inputController, x, y, target, targetType, event)
  {
    //Make sure to lose focus on label editors
    /*
    if (this.labelEditor.hasFocus())
    {
      this.labelEditor.closeEditor();
      event.result = false;
    }
    */

    const pointer = this.inputController.getPointer();
    const picker = this.inputController.getPicker();

    if (picker.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !picker.isTargetInSelection(target))
      {
        picker.clearSelection();
      }
    }

    //Disable all graph input when in step-by-step mode
    if (this.controller.tester.getStepByStepMode())
    {
      event.result = false;
    }
  }

  onInputMove(inputController, x, y, target, targetType)
  {

  }

  onInputUp(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

    if (targetType === 'none')
    {
      const dx = x - this.firstEmptyX;
      const dy = y - this.firstEmptyY;
      //If within the time to double tap...
      if (this.firstEmptyClick && (dx * dx + dy * dy) < (Config.CURSOR_RADIUS_SQU * 16) && (Date.now() - this.firstEmptyTime < Config.DOUBLE_TAP_TICKS))
      {
        this.createNodeHandler.onDblActionEvent(pointer, picker);

        this.firstEmptyClick = false;
      }
      else
      {
        //This is the first empty click, should wait for another...
        this.firstEmptyClick = true;
        this.firstEmptyTime = Date.now();
        this.firstEmptyX = x;
        this.firstEmptyY = y;
      }

      return true;
    }
  }

  onInputAction(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

    //If is in trash mode... capture all events!
    if (this.trashModeHandler.onActionEvent(pointer, picker)) return true;

    //If not in Trash Mode, then events should pass through to here...
    //Otherwise, ALL events are captured to prevent ALL default behavior.

    //Makes sure that user cannot toggle state while in trash mode
    if (this.acceptNodeHandler.onActionEvent(pointer, picker)) return true;
    //Edit label for selected edge
    if (this.editLabelHandler.onActionEvent(pointer, picker)) return true;

    return false;
  }

  onDragStart(inputController, x, y, target, targetType)
  {
    const viewport = inputController.getViewport();
    //TODO: sometimes, pointer.target is null when it should not be...
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //Make sure it is not in trash mode
      if (inputController.isTrashMode())
      {
        pointer.moveMode = false;

        this.controller.emit("tryCreateWhileTrash");
        return false;
      }

      //Make sure it is not in new edge mode
      this.isNewEdge = false;

      //Makes sure that placeholders are not quadratics!
      if (targetType === 'edge' && target.isPlaceholder())
      {
        pointer.moveMode = false;

        //Ignore drag event...
        return false;
      }
      //Moving node (and selected nodes)
      else if (targetType === 'node')
      {
        //target MUST be an instance of Node...
        if (!(target instanceof Node))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Node.");

        //Ready to move node(s)...
        this.controller.prevX = target.x;
        this.controller.prevY = target.y;
        return true;
      }
      //Moving edge center point
      else if (targetType === 'edge')
      {
        //target MUST be an instance of Edge...
        if (!(target instanceof Edge))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

        //Makes sure that placeholders are not quadratics!
        if (target.isPlaceholder())
        {
          pointer.moveMode = false;
          return false;
        }

        //Save previous quadratics
        target.copyQuadraticsTo(this.controller.prevQuad);
        //this.prevQuad.x = target.quad.x;
        //this.prevQuad.y = target.quad.y;

        //Ready to move the edge vertex to pointer...
        return true;
      }
      //Moving edge endpoint
      else if (targetType === 'endpoint')
      {
        //target MUST be an instance of Edge...
        if (!(target instanceof Edge))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

        target.copyQuadraticsTo(this.controller.prevQuad);
        //this.prevQuad.x = target.quad.x;
        //this.prevQuad.y = target.quad.y;
        this.controller.prevEdgeTo = target.to;
        this.isNewEdge = false;

        //Ready to move the edge endpoint to pointer...
        return true;
      }
      //Moving initial marker
      else if (targetType === 'initial')
      {
        this.ghostInitialMarker = pointer;

        //Ready to move the initial marker to another state...
        return true;
      }
      //Moving nothing
      else if (targetType === 'none')
      {
        //Reuse nodal prev pos for graph prev pos
        this.controller.prevX = x;
        this.controller.prevY = y;
        this.prevOffsetX = viewport.getOffsetX();
        this.prevOffsetY = viewport.getOffsetY();

        //Ready to move the graph to pointer...
        return true;
      }
      else
      {
        //All move drag should be handled
        throw new Error("Unknown target type \'" + targetType + "\'.");
      }

      return true;
    }
    //If is NOT in move mode...
    else
    {
      //If action dragged a node...
      if (targetType === 'node')
      {
        if (!inputController.isTrashMode())
        {
          const edge = this.controller.graph.newEdge(target, pointer, Config.STR_TRANSITION_DEFAULT_LABEL);

          //Redirect pointer to refer to the edge as the new target
          picker.setInitialTarget(edge, "endpoint");
          this.isNewEdge = true;

          //Reset previous quad values for new proxy edge
          edge.copyQuadraticsTo(this.controller.prevQuad);
          //this.prevQuad.x = 0;
          //this.prevQuad.y = 0;

          //Ready to move proxy edge to pointer...
          pointer.moveMode = true;
          return true;
        }
        else
        {
          this.controller.emit("tryCreateWhileTrash");
        }
      }
      else if (targetType === 'endpoint')
      {
        //This is the same as dragging with moveMode endpoint

        //target MUST be an instance of Edge...
        if (!(target instanceof Edge))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

        target.copyQuadraticsTo(this.controller.prevQuad);
        this.controller.prevEdgeTo = target.to;
        this.isNewEdge = false;

        pointer.moveMode = true;

        //Ready to move the edge endpoint to pointer...
        return true;
      }
      //If action dragged nothing...
      else if (targetType === 'none')
      {
        //Begin selection box...
        picker.beginSelection(x, y);
        return true;
      }
      else
      {
        //Other action drags are ignored, such as:
        // - Edges
        return false;
      }
    }

    return false;
  }

  onDragMove(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //Continue to move node(s)
      if (targetType === 'node')
      {
        if (picker.hasSelection())
        {
          this.controller.moveMultipleNodesTo(pointer, picker.getSelection(), x, y);
        }
        else
        {
          this.controller.moveNodeTo(pointer, target, x, y);
        }
        return true;
      }
      //Continue to move edge vertex
      else if (targetType === 'edge')
      {
        this.controller.moveEdgeTo(pointer, target, x, y);
        return true;
      }
      //Continue to move edge endpoint
      else if (targetType === 'endpoint')
      {
        this.controller.moveEndpointTo(pointer, target, x, y);
        return true;
      }
      //Continue to move initial
      else if (targetType === 'initial')
      {
        //Move initial marker to node or pointer
        const dst = picker.getNodeAt(x, y) || pointer;
        this.ghostInitialMarker = dst;
        return true;
      }
      //Continue to move graph
      else if (targetType === 'none')
      {
        //Move graph
        const dx = x - this.controller.prevX;
        const dy = y - this.controller.prevY;
        this.inputController.getViewport().addOffset(dx, dy, true);
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
      //If the selection box is active...
      if (picker.isSelecting())
      {
        //Update the selection box
        picker.updateSelection(x, y);
        return true;
      }

      //Otherwise, don't do anything. Cause even action drags will become move drags.
    }

    return false;
  }

  onDragStop(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

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
            this.controller.deleteSelectedNodes(target);
          }
          else
          {
            //Delete a single node
            this.controller.deleteTargetNode(target);
          }

          return true;
        }
        //If dragged to an empty space (not trash)
        else
        {
          //Do nothing, since should have moved to position
          if (picker.hasSelection())
          {
            const dx = x - this.controller.prevX;
            const dy = y - this.controller.prevY;
            this.controller.emit("nodeMoveAll", picker.getSelection(), dx, dy);
          }
          else
          {
            this.controller.emit("nodeMove", target, x, y, this.controller.prevX, this.controller.prevY);
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
          this.controller.deleteTargetEdge(target);
        }
        else
        {
          //Do nothing, since should have moved to position
          this.controller.emit("edgeMove", target, target.getQuadratic(), this.controller.prevQuad);
        }
        return true;
      }
      //If stopped dragging a endpoint...
      else if (targetType === 'endpoint')
      {
        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
          this.controller.deleteTargetEdge(target);
          return true;
        }
        //If hovering over a node...
        else if (target.to instanceof Node)
        {
          const targetNode = target.to;

          //TODO: this is the same in graph.newEdge
          //Look for an existing edge with similar from and to
          for(const edge of this.controller.graph.edges)
          {
            if (edge !== target && edge.from === target.from && picker.isTarget(edge.to))
            {
              let result = edge.label.split(",");
              if (target.label !== Config.STR_TRANSITION_DEFAULT_LABEL)
              {
                result = result.concat(target.label.split(","));
              }

              //Allow the user to edit the merged labels
              this.controller.openLabelEditor(edge, x, y, result.join(","), false);

              //Delete the merged label
              this.controller.graph.deleteEdge(target);
              return true;
            }
          }

          //If the edge has changed...
          if (this.controller.prevEdgeTo !== null)
          {
            //Make sure that it's previous edge was not null
            target._to = this.controller.prevEdgeTo;
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

            for(const node of this.controller.graph.nodes)
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
              target.copyQuadraticsFrom(this.controller.prevQuad);
            }
          }

          if (this.isNewEdge)
          {
            //Moved below to allow openLabelEditor to check it...
            //this.isNewEdge = false;

            //Emit event
            this.controller.emit("userCreateEdge", this.controller.graph, target);
          }
          else if (this.controller.prevEdgeTo !== null)
          {
            //Emit event
            this.controller.emit("edgeDestination", target, target.to, this.controller.prevEdgeTo, this.controller.prevQuad);
          }

          //TODO: this is the same in graph.newEdge
          //Bend away if there is another edge not bent with the same src/dst
          for(const edge of this.controller.graph.edges)
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
            if (this.isNewEdge)
            {
              this.controller.openLabelEditor(target, x, y, null, true, () => {
                this.controller.emit("userPostCreateEdge", this.controller.graph, target);
              });
            }
            else
            {
              this.openLabelEditor(target, x, y);
            }
          }

          //Moved from userCreateEdge event emit to here to allow openLabelEditor to check it
          this.isNewEdge = false;

          return true;
        }
        //If hovering over anything else...
        else
        {
          //Destroy any edge that no longer have a destination
          if (this.shouldDestroyPointlessEdges)
          {
            this.controller.graph.deleteEdge(target);
            return true;
          }
          //Keep edges as placeholders (used in DFA's)
          else
          {
            target.makePlaceholder();

            //Open label editor if default edge...
            if (target.label === Config.STR_TRANSITION_DEFAULT_LABEL)
            {
              this.controller.openLabelEditor(target, x, y);
            }
            return true;
          }
        }
      }
      else if (targetType === 'initial')
      {
        //If valid initial object to mark...
        if (this.ghostInitialMarker instanceof Node)
        {
          const prevInitial = this.controller.graph.getStartNode();

          //Set the new object as the initial node
          this.controller.graph.setStartNode(this.ghostInitialMarker);

          //Emit event
          this.controller.emit("nodeInitial", this.ghostInitialMarker, prevInitial);
        }

        //Reset ghost initial marker
        this.ghostInitialMarker = null;
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

export default GraphAdapter;
