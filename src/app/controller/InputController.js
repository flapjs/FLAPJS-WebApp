import Config from 'config.js';

import InputAdapter from 'system/inputadapter/InputAdapter.js';
import Viewport from 'system/inputadapter/Viewport.js';

import GraphPicker from './GraphPicker.js';
import Node from 'modules/fsa/graph/FSANode.js';
import Edge from 'modules/fsa/graph/FSAEdge.js';

class InputController
{
  constructor()
  {
    this._module = null;

    //TODO: Should this live here?
    this._viewport = new Viewport()
      .setMinScale(Config.MIN_SCALE)
      .setMaxScale(Config.MAX_SCALE)
      .setOffsetDamping(Config.SMOOTH_OFFSET_DAMPING);

    //TODO: Should this live here?
    this._inputAdapter = new InputAdapter()
      .setController(this);

    this._picker = new GraphPicker();

    this._graphController = null;

    //Used to check if target needs to be updated for the hover effect
    this.prevPointerX = 0;
    this.prevPointerY = 0;

    //Make sure this is always false when moving endpoints
    this.isNewEdge = false;

    //Used to change render to follow pointer when moving initial marker
    this.ghostInitialMarker = null;

    //Whether to destroy pointless edges
    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;

    //Swap left to right clicks and vice versa on anything else but Macs
    this._swapMouseScheme = true;//!navigator.platform.startsWith("Mac");

    //Used to determine whether the target should be destroyed because of trash mode
    this._trashMode = false;
  }

  setModule(module)
  {
    this._module = module;
  }

  getModule()
  {
    return this._module;
  }

  initialize(app)
  {
    this._graphController = app.graphController;

    const element = app.workspace.ref;
    this._viewport.setElement(element);
    this._inputAdapter.initialize(this._viewport);
  }

  destroy()
  {
    this._inputAdapter.destroy();
  }

  update()
  {
    //Smooth transition offset
    this._viewport.update();

    const graph = this._graphController.getGraph();
    const picker = this._picker;
    const x = this._inputAdapter.getPointerX();
    const y = this._inputAdapter.getPointerY();

    if (x != this.prevPointerX || y != this.prevPointerY)
    {
      this.prevPointerX = x;
      this.prevPointerY = y;

      //Update target
      picker.updateTarget(graph, x, y);

      //HACK: to make the cursor look like a pointer when targeting
      if (picker.hasTarget())
      {
        document.body.style.cursor = "pointer";
      }
      else
      {
        document.body.style.cursor = "auto";
      }
    }
  }

  //Override
  onPreInputEvent(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;

    const graph = graphController.getGraph();
    const picker = inputController.getPicker();
    picker.updateTarget(graph, pointer.x, pointer.y);
    picker.setInitialTarget(picker.target, picker.targetType);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //Make sure to lose focus on label editors
    /*
    if (this.labelEditor.hasFocus())
    {
      this.labelEditor.closeEditor();
      event.result = false;
    }
    */

    if (picker.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !picker.isTargetInSelection(target))
      {
        picker.clearSelection();
      }
    }

    //Disable all graph input when in step-by-step mode
    if (graphController.tester.getStepByStepMode())
    {
      //Consume event!
      return true;
    }

    return false;
  }

  //Override
  onInputEvent(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;

    const x = pointer.x;
    const y = pointer.y;

    const graph = graphController.getGraph();
    const picker = inputController.getPicker();
    picker.updateTarget(graph, x, y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in trash mode... capture all events!
    if (inputController.isTrashMode())
    {
      //Click to delete node
      if (targetType === 'node')
      {
        //So that the emitted 'delete' events can use this
        graphController.prevX = target.x;
        graphController.prevY = target.y;

        //If there exists selected states, delete them all!
        if (picker.hasSelection())
        {
          //Delete all selected nodes
          graphController.deleteSelectedNodes(target);
        }
        else
        {
          //Delete a single node
          graphController.deleteTargetNode(target);
        }

        return true;
      }
      else if (targetType === 'edge' || targetType === 'endpoint')
      {
        //Delete a single edge
        graphController.deleteTargetEdge(target);
        return true;
      }

      //Clicked on something you cannot delete
      //return true;
      return false;
    }

    //If not in Trash Mode, then events should pass through to here...
    //Otherwise, ALL events are captured to prevent ALL default behavior.

    //Makes sure that user cannot toggle state while in trash mode
    if (targetType === 'node')
    {
      graphController.toggleNode(target);
      return true;
    }
    //Edit label for selected edge
    else if (targetType === 'edge')
    {
      graphController.openLabelEditor(target, x, y);
      return true;
    }

    return false;
  }

  //Override
  onAltInputEvent(pointer)
  {
    return this.onInputEvent(pointer);
  }

  //Override
  onDblInputEvent(pointer)
  {
    const graphController = this._graphController;
    const x = pointer.x;
    const y = pointer.y;

    if (!this.isTrashMode())
    {
      //Create state at position
      graphController.createNode(x, y);
      return true;
    }
    else
    {
      graphController.emit("tryCreateWhileTrash");
      return true;
    }

    return false;
  }

  //Override
  onDragStart(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;

    const graph = graphController.getGraph();
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    const viewport = inputController.getViewport();

    //If is in move mode...
    if (inputController.isMoveMode())
    {
      //Make sure it is not in trash mode
      if (inputController.isTrashMode())
      {
        //inputController.setMoveMode(false, true);//Set to false

        graphController.emit("tryCreateWhileTrash");
        return false;
      }

      //Make sure it is not in new edge mode
      inputController.isNewEdge = false;

      //Makes sure that placeholders are not quadratics!
      if (targetType === 'edge' && target.isPlaceholder())
      {
        //inputController.setMoveMode(false, true);//Set to false

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
        graphController.prevX = target.x;
        graphController.prevY = target.y;
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
          //inputController.setMoveMode(false, true);//Set to false
          return false;
        }

        //Save previous quadratics
        const targetQuad = target.getQuadratic();
        graphController.prevQuad.radians = targetQuad.radians;
        graphController.prevQuad.length = targetQuad.length;

        //Ready to move the edge vertex to pointer...
        return true;
      }
      //Moving initial marker
      else if (targetType === 'initial')
      {
        inputController.ghostInitialMarker = pointer;

        //Ready to move the initial marker to another state...
        return true;
      }
      //Moving nothing
      else if (targetType === 'none')
      {
        //Reuse nodal prev pos for graph prev pos
        graphController.prevX = x;
        graphController.prevY = y;

        //Ready to move the graph to pointer...
        return true;
      }
    }
    //If is NOT in move mode...
    else
    {
      //If input dragged a node...
      if (targetType === 'node')
      {
        if (!inputController.isTrashMode())
        {
          const edge = graph.createEdge(target, pointer);
          edge.setEdgeLabel(Config.STR_TRANSITION_DEFAULT_LABEL);

          //Redirect pointer to refer to the edge as the new target
          picker.setInitialTarget(edge, "endpoint");
          inputController.isNewEdge = true;

          //Reset previous quad values for new proxy edge
          const edgeQuad = edge.getQuadratic();
          graphController.prevQuad.radians = edgeQuad.radians;
          graphController.prevQuad.length = edgeQuad.length;

          //Ready to move proxy edge to pointer...
          //inputController.setMoveMode(true, true);
          return true;
        }
        else
        {
          graphController.emit("tryCreateWhileTrash");
          return false;
        }
      }
      else if (targetType == 'edge')
      {
        //Do nothing.
        return false;
      }
      //If input dragged nothing...
      else if (targetType === 'none')
      {
        //Begin selection box...
        picker.beginSelection(graph, x, y);
        return true;
      }
    }

    //In either moving or not... moving endpoints
    if (targetType === 'endpoint')
    {
      //target MUST be an instance of Edge...
      if (!(target instanceof Edge))
        throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

      const targetQuad = target.getQuadratic();
      graphController.prevQuad.radians = targetQuad.radians;
      graphController.prevQuad.length = targetQuad.length;

      graphController.prevEdgeTo = target.getDestinationNode();
      inputController.isNewEdge = inputController.isMoveMode() ? false : true;

      //Ready to move the edge endpoint to pointer...
      return true;
    }

    //All input should be handled
    //throw new Error("Unknown target type \'" + targetType + "\'.");

    return false;
  }

  //Override
  onDragMove(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;
    const graph = graphController.getGraph();

    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in move mode...
    if (inputController.isMoveMode())
    {
      //Continue to move node(s)
      if (targetType === 'node')
      {
        if (picker.hasSelection())
        {
          graphController.moveMultipleNodesTo(pointer, picker.getSelection(graph), x, y);
        }
        else
        {
          graphController.moveNodeTo(pointer, target, x, y);
        }
        return true;
      }
      //Continue to move edge vertex
      else if (targetType === 'edge')
      {
        graphController.moveEdgeTo(pointer, target, x, y);
        return true;
      }
      //Continue to move edge endpoint
      else if (targetType === 'endpoint')
      {
        graphController.moveEndpointTo(pointer, target, x, y);
        return true;
      }
      //Continue to move initial
      else if (targetType === 'initial')
      {
        //Move initial marker to node or pointer
        const dst = picker.getNodeAt(graph, x, y) || pointer;
        inputController.ghostInitialMarker = dst;
        return true;
      }
      //Continue to move graph
      else if (targetType === 'none')
      {
        //Move graph
        const dx = x - graphController.prevX;
        const dy = y - graphController.prevY;
        inputController.getViewport().addOffset(dx, dy, true);
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
      if (inputController.isNewEdge)
      {
        graphController.moveEndpointTo(pointer, target, x, y);
        return true;
      }

      //If the selection box is active...
      if (picker.isSelecting())
      {
        //Update the selection box
        picker.updateSelection(graph, x, y);
        return true;
      }

      //Otherwise, don't do anything. Cause even input drags will become move drags.
    }
  }

  //Override
  onDragStop(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;

    const graph = graphController.getGraph();
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    picker.updateTarget(graph, x, y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in move mode...
    if (inputController.isMoveMode() || inputController.isNewEdge)
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
            graphController.emit("nodeMoveAll", graph, picker.getSelection(graph), dx, dy);
          }
          else
          {
            graphController.emit("nodeMove", graph, target, x, y, graphController.prevX, graphController.prevY);
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
          graphController.emit("edgeMove", graph, target, target.getQuadratic(), graphController.prevQuad);
        }
        return true;
      }
      //If stopped dragging a endpoint...
      else if (inputController.isNewEdge || targetType === 'endpoint')
      {
        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
          graphController.deleteTargetEdge(target);
          return true;
        }
        //If hovering over a node...
        else if (target.getDestinationNode() instanceof Node)
        {
          const result = graph.formatEdge(target);

          //If a different edge is the result of the target...
          if (result !== target)
          {
            //Allow the user to edit the merged labels
            graphController.openLabelEditor(result, x, y, result.getEdgeLabel(), false);

            //Delete the merged label
            graph.deleteEdge(target);
            return true;
          }
          //Open label editor if a new edge...
          else
          {
            if (inputController.isNewEdge)
            {
              graphController.openLabelEditor(target, x, y, null, true, () => {
                graphController.emit("userPostCreateEdge", graph, target);
              });
            }
            else
            {
              graphController.openLabelEditor(target, x, y);
            }
          }

          if (inputController.isNewEdge)
          {
            //Must be after openLabelEditor() to allow the function to check it...
            inputController.isNewEdge = false;

            //Emit event
            graphController.emit("userCreateEdge", graph, target);
          }
          else if (graphController.prevEdgeTo !== null)
          {
            //Emit event
            graphController.emit("edgeDestination", graph, target, target.getDestinationNode(), graphController.prevEdgeTo, graphController.prevQuad);
          }

          return true;
        }
        //If hovering over anything else...
        else
        {
          //Destroy any edge that no longer have a destination
          if (inputController.shouldDestroyPointlessEdges)
          {
            if (!inputController.isNewEdge)
            {
              graphController.deleteTargetEdge(target);
            }
            else
            {
              graph.deleteEdge(target);
            }
            return true;
          }
          //Keep edges as placeholders (used in DFA's)
          else
          {
            target.changeDestinationNode(null);

            //Open label editor if default edge...
            if (target.getEdgeLabel().length <= 0)
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
          const prevInitial = graph.getStartNode();

          //Set the new object as the initial node
          graph.setStartNode(inputController.ghostInitialMarker);

          //Emit event
          graphController.emit("nodeInitial", graph, inputController.ghostInitialMarker, prevInitial);
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
        picker.endSelection(graph, x, y);
        return true;
      }
    }

    return false;
  }

  //Override
  onPostInputEvent(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;
    const graph = graphController.getGraph();
    const picker = inputController.getPicker();

    picker.clearTarget();
    picker.updateTarget(graph, pointer.x, pointer.y);
  }

  //Override
  onZoomChange(pointer, zoomValue, prevValue)
  {
    return true;
  }

  getViewport()
  {
    return this._viewport;
  }

  setTrashMode(enabled)
  {
    this._trashMode = enabled;
  }

  isTrashMode()
  {
    return this._trashMode;
  }

  setInputScheme(shouldInputFirst)
  {
    this._swapMouseScheme = !shouldInputFirst;
  }

  getInputScheme()
  {
    return this._swapMouseScheme;
  }

  isMoveMode()
  {
    const result = this._inputAdapter.isAltInput();
    return this._swapMouseScheme ? !result : result;
  }

  isDragging()
  {
    return this._inputAdapter.isDragging();
  }

  isActionMode(graphController)
  {
    return this._inputAdapter.isPointerActive() ?
      //Is considered an input when NOT moving or when creating a new edge...
      graphController.isNewEdge || !this.isMoveMode() :
      //If not active, just show default input...
      !this._swapMouseScheme;
  }

  getPicker()
  {
    return this._picker;
  }

  getAdapter()
  {
    return this._inputAdapter;
  }
}

export default InputController;
