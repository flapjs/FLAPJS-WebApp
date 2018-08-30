import Config from 'config.js';

import Eventable from 'util/Eventable.js';

import SelectionBox from './SelectionBox.js';
import Uploader from './Uploader.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

import GraphLayout from "graph/GraphLayout.js";

class GraphController
{
  constructor(graph)
  {
    this.graph = graph;

    this.inputController = null;
    this.machineController = null;

    this.labelEditor = null;
    this.selector = new SelectionBox(graph);
    this.uploader = new Uploader(this);

    this.prevQuad = {
      radians: 0, length: 0,
      x: 0, y: 0
    };
    this.prevEdgeTo = null;
    this.prevX = 0;
    this.prevY = 0;
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

    this.onInputDown = this.onInputDown.bind(this);
    this.onInputMove = this.onInputMove.bind(this);
    this.onInputUp = this.onInputUp.bind(this);
    this.onInputAction = this.onInputAction.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    //The difference between controller events vs graph events is: controller has user-intent

    //userCreateNode(graph, node) - When user creates a node
    this.registerEvent("userCreateNode");
    this.registerEvent("userPreCreateNode");//(graph, nextNodeID, x, y)
    this.registerEvent("userPostCreateNode");//(graph, node)

    //userToggleNode(graph, node, prevAccept) - When user toggles the accept state
    this.registerEvent("userToggleNode");

    //userDeleteNodes(graph, node, targetNodes, prevX, prevY) - When user deletes one or more nodes
    this.registerEvent("userDeleteNodes");
    this.registerEvent("userPreDeleteNodes");
    this.registerEvent("userPostDeleteNodes");

    //userDeleteEdge(graph, edge, prevTo, prevQuad) - When user deletes an edge
    this.registerEvent("userDeleteEdge");
    this.registerEvent("userPreDeleteEdge");
    this.registerEvent("userPostDeleteEdge");

    //userCreateEdge(graph, edge) - When user creates an edge, after naming it
    this.registerEvent("userCreateEdge");
    //this.registerEvent("userPreCreateEdge");
    this.registerEvent("userPostCreateEdge");

    /*
    //userMoveNodes(graph, nodes, dx, dy) - When user moves one or more nodes
    this.registerEvent("userMoveNodes");
    //userMoveInitial(graph, node, prevNode) - When user moves the initial marker to another
    this.registerEvent("userMoveInitial");
    //userPreCreateEdge(graph, edge) - When user is about to create an edge, before src
    this.registerEvent("userPreCreateEdge");
    //userBeginEdge(graph, edge, src) - When user begins to create an edge, after src and before naming it
    this.registerEvent("userBeginEdge");
    //userEndEdge(graph, edge, src, dst) - When user finishes creating an edge, after dst and before naming it (dst could be null for deletion)
    this.registerEvent("userEndEdge");
    //userPostCreateEdge(graph, edge) - When user is finished creating an edge, after dst and after quad changes
    this.registerEvent("userPostCreateEdge");
    //userMoveEdge(graph, edge, prevDest) - When user changes the dst of edge
    this.registerEvent("userChangeEdge");
    //userBendEdge(graph, edge, prevQuad) - When user bends the edge
    this.registerEvent("userBendEdge");
    //userLabelEdge(graph, edge, prevLabel) - When user re-labels the edge
    this.registerEvent("userLabelEdge");
    */

    //userSwapNodes(graph, node, otherNode) - When user swap node indices
    this.registerEvent("userSwapNodes");

    //userRenameNode(graph, node, nextLabel, prevLabel, isPrevCustom) - When user sets the label of node
    this.registerEvent("userRenameNode");

    //userChangeLayout(graph, prevLayout) - When user re-layouts the graph
    this.registerEvent("userChangeLayout");
    this.registerEvent("userPreChangeLayout");//before any changes
    this.registerEvent("userPostChangeLayout");//after all changes

    //userImportGraph(graph) - When user imports a graph
    this.registerEvent("userImportGraph");
    this.registerEvent("userPreImportGraph");//before any changes
    this.registerEvent("userPostImportGraph");//after all changes

    //nodeMove(targetNode, nextX, nextY, prevX, prevY)
    this.registerEvent("nodeMove");
    //nodeMoveAll(targetNodes, dx, dy)
    this.registerEvent("nodeMoveAll");
    //nodeInitial(nextInitial, prevInitial)
    this.registerEvent("nodeInitial");
    //edgeDestination(targetEdge, nextDestination, prevDestination, prevQuad)
    this.registerEvent("edgeDestination");
    //edgeMove(targetEdge, nextQuad, prevQuad)
    this.registerEvent("edgeMove");
    //edgeLabel(targetEdge, nextLabel, prevLabel)
    this.registerEvent("edgeLabel");
    //tryCreateWhileTrash()
    this.registerEvent("tryCreateWhileTrash");
  }

  initialize(app)
  {
    this.labelEditor = app.viewport.labelEditor;

    this.inputController = app.inputController;
    this.machineController = app.machineController;

    this.uploader.setMachineController(this.machineController);

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

  getGraph()
  {
    return this.graph;
  }

  getLabelEditor()
  {
    return this.labelEditor;
  }

  getSelector()
  {
    return this.selector;
  }

  getUploader()
  {
    return this.uploader;
  }

  applyAutoLayout()
  {
    this.emit("userPreChangeLayout", this.graph);

    GraphLayout.applyLayout(this.graph);

    this.emit("userChangeLayout", this.graph);
    this.emit("userPostChangeLayout", this.graph);
  }

  renameNode(node, name)
  {
    const prev = node.label;
    const isPrevCustom = node.hasCustomLabel();

    node.setCustomLabel(name);

    this.emit("userRenameNode", this.graph, node, name, prev, isPrevCustom);
  }

  swapNodeByIndex(nodeIndex, otherNodeIndex)
  {
    const node = this.graph.nodes[nodeIndex];
    const other = this.graph.nodes[otherNodeIndex];
    this.graph.nodes[otherNodeIndex] = node;
    this.graph.nodes[nodeIndex] = other;

    this.emit("userSwapNodes", this.graph, node, other);
  }

  createNode(x, y)
  {
    const newNodeLabel = this.machineController.getMachineBuilder().getLabeler().getNextDefaultNodeLabel();

    if (typeof x === 'undefined') x = (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    if (typeof y === 'undefined') y = (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;

    this.emit("userPreCreateNode", this.graph, newNodeLabel, x, y);

    const node = this.graph.newNode(x, y, newNodeLabel);
    node.x = x;
    node.y = y;

    this.emit("userCreateNode", this.graph, node);

    this.emit("userPostCreateNode", this.graph, node);
    return node;
  }

  toggleNode(node)
  {
    const prev = node.accept;
    const result = !node.accept;
    //Toggle accept for selected node
    node.accept = result;

    //Emit event
    this.emit("userToggleNode", this.graph, node, prev);
  }

  deleteSelectedNodes(selectedNode)
  {
    const selector = this.selector;
    const selection = selector.getSelection().slice();

    this.emit("userPreDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);

    //Remove from graph
    for(const node of selection)
    {
      this.graph.deleteNode(node);
    }

    //Remove from selection
    selector.clearSelection();

    //Emit event
    this.emit("userDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);
    this.emit("userPostDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);
  }

  deleteTargetNode(target)
  {
    this.emit("userPreDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);

    this.graph.deleteNode(target);

    //Emit event
    this.emit("userDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);
    this.emit("userPostDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);
  }

  createEdge()
  {

  }

  deleteTargetEdge(target)
  {
    this.emit("userPreDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
    this.graph.deleteEdge(target);

    //Emit event
    this.emit("userDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
    this.emit("userPostDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
  }

  moveNodeTo(pointer, node, x, y)
  {
    for(const other of this.graph.nodes)
    {
      //Update node collision
      if (node === other) continue;

      const dx = x - other.x;
      const dy = y - other.y;
      const angle = Math.atan2(dy, dx);

      const diameter = (Config.NODE_RADIUS * 2);
      const nextDX = other.x + (Math.cos(angle) * diameter) - x;
      const nextDY = other.y + (Math.sin(angle) * diameter) - y;

      if (dx * dx + dy * dy < Config.NODE_RADIUS_SQU * 4)
      {
        x += nextDX;
        y += nextDY;
      }
    }

    node.x = x;
    node.y = y;
  }

  moveMultipleNodesTo(pointer, nodes, x, y)
  {
    //Moves all nodes by difference between initial position with passed-in x and y
    const dx = x - pointer.initial.x;
    const dy = y - pointer.initial.y;
    for(const node of nodes)
    {
      node.x += dx;
      node.y += dy;
    }

    //Updates initial position to passed-in x and y to maintain relative position
    pointer.initial.x = x;
    pointer.initial.y = y;
  }

  moveEdgeTo(pointer, edge, x, y)
  {
    edge.setQuadraticByPosition(x, y);
  }

  moveEndpointTo(pointer, edge, x, y)
  {
    //Get ONLY node at x and y (cannot use hover target, since it is not ONLY nodes)
    const dst = pointer.getNodeAt(x, y) || pointer;
    edge._to = dst;

    //If the cursor returns to the state after leaving it...
    if (edge.isSelfLoop())
    {
      //Make it a self loop
      const dx = edge.from.x - x;
      const dy = edge.from.y - y;
      const angle = Math.atan2(dy, dx);
      edge.makeSelfLoop(angle);
    }
    //Otherwise, maintain original curve
    else
    {
      edge.copyQuadraticsFrom(this.prevQuad);
    }
  }

  openLabelEditor(target, x, y, placeholder=null, replace=true, callback=null)
  {
    const prevLabel = placeholder || target.label;
    this.labelEditor.openEditor(target, placeholder, replace, () => {
      const label = target.label;
      if (prevLabel.length > 0 && label != prevLabel)
      {
        this.emit("edgeLabel", target, label, prevLabel);
      }

      if (callback)
      {
        callback();
      }
    });
  }

  focusOnNode(node)
  {
    //Center workspace at focused node; inverted due to graph-to-screen space
    this.inputController.getPointer().setOffset(-node.x, -node.y);
  }

  focusOnEdge(edge)
  {
    //Center workspace at focused edge; inverted due to graph-to-screen space
    const center = edge.getCenterPoint();
    this.inputController.getPointer().setOffset(-center.x, -center.y);
  }

  /*************************************************************************
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * INPUT CONTROLS
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *************************************************************************/

  onInputDown(inputController, x, y, target, targetType, event)
  {
    //Make sure to lose focus on label editors
    if (this.labelEditor.inputElement === document.activeElement)
    {
      this.labelEditor.inputElement.blur();
      event.result = false;
    }

    if (this.selector.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !this.selector.isTargetSelected(target))
      {
        this.selector.clearSelection();
      }
    }
  }

  onInputMove(inputController, x, y, target, targetType)
  {

  }

  onInputUp(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();

    if (targetType === 'none')
    {
      const dx = x - this.firstEmptyX;
      const dy = y - this.firstEmptyY;
      //If within the time to double tap...
      if (this.firstEmptyClick && (dx * dx + dy * dy) < (Config.CURSOR_RADIUS_SQU * 16) && (Date.now() - this.firstEmptyTime < Config.DOUBLE_TAP_TICKS))
      {
        if (!pointer.isTrashMode(x, y))
        {
          //Create state at position
          this.createNode(x, y);
        }
        else
        {
          this.emit("tryCreateWhileTrash");
        }

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
    const trashMode = pointer.isTrashMode(x, y);

    //Makes sure that user cannot toggle state while in trash mode
    if (targetType === 'node')
    {
      if (!trashMode)
      {
        this.toggleNode(target);
        return true;
      }
    }

    //If is in move mode...
    /*
    if (pointer.isMoveMode())
    {
      pointer.moveMode = false;
      //this.emit("tryCreateWhileTrash");

      return false;
    }
    //If is NOT in move mode...
    else
    {
      //Do the remaining deleting code
    }
    */

    //If is in trash mode... capture all events!
    if (trashMode)
    {
      //Click to delete node
      if (targetType === 'node')
      {
        //So that the emitted 'delete' events can use this
        this.prevX = target.x;
        this.prevY = target.y;

        //If there exists selected states, delete them all!
        const selector = this.selector;
        if (selector.hasSelection())
        {
          //Delete all selected nodes
          this.deleteSelectedNodes(target);
        }
        else
        {
          //Delete a single node
          this.deleteTargetNode(target);
        }

        return true;
      }
      else if (targetType === 'edge' || targetType === 'endpoint')
      {
        //Delete a single edge
        this.deleteTargetEdge(target);
        return true;
      }
      else
      {
        //Clicked on something you cannot delete
        return false;
      }
    }

    //If not in Trash Mode, then events should pass through to here...
    //Otherwise, ALL events are captured to prevent ALL default behavior.

    //If selected target...
    if (targetType === 'edge')
    {
      //Edit label for selected edge
      this.openLabelEditor(target, x, y);
      return true;
    }
    else
    {
      return false;
    }
  }

  onDragStart(inputController, x, y, target, targetType)
  {
    //TODO: sometimes, pointer.target is null when it should not be...
    const pointer = inputController.getPointer();

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //Make sure it is not in trash mode
      if (pointer.isTrashMode(x, y))
      {
        pointer.moveMode = false;

        this.emit("tryCreateWhileTrash");
        return false;
      }

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
        this.prevX = target.x;
        this.prevY = target.y;
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
        target.copyQuadraticsTo(this.prevQuad);
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

        target.copyQuadraticsTo(this.prevQuad);
        //this.prevQuad.x = target.quad.x;
        //this.prevQuad.y = target.quad.y;
        this.prevEdgeTo = target.to;
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
        this.prevX = x;
        this.prevY = y;
        this.prevOffsetX = pointer.offsetX;
        this.prevOffsetY = pointer.offsetY;

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
        if (!pointer.isTrashMode(x, y))
        {
          const edge = this.graph.newEdge(target, pointer, Config.STR_TRANSITION_DEFAULT_LABEL);

          //Redirect pointer to refer to the edge as the new target
          pointer.initial.target = edge;
          pointer.initial.targetType = "endpoint";
          this.isNewEdge = true;

          //Reset previous quad values for new proxy edge
          edge.copyQuadraticsTo(this.prevQuad);
          //this.prevQuad.x = 0;
          //this.prevQuad.y = 0;

          //Ready to move proxy edge to pointer...
          pointer.moveMode = true;
          return true;
        }
        else
        {
          this.emit("tryCreateWhileTrash");
        }
      }
      else if (targetType === 'endpoint')
      {
        //This is the same as dragging with moveMode endpoint

        //target MUST be an instance of Edge...
        if (!(target instanceof Edge))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

        target.copyQuadraticsTo(this.prevQuad);
        this.prevEdgeTo = target.to;
        this.isNewEdge = false;

        pointer.moveMode = true;

        //Ready to move the edge endpoint to pointer...
        return true;
      }
      //If action dragged nothing...
      else if (targetType === 'none')
      {
        //Begin selection box...
        this.selector.beginSelection(x, y);
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

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //Continue to move node(s)
      if (targetType === 'node')
      {
        const selector = this.selector;
        if (selector.hasSelection())
        {
          this.moveMultipleNodesTo(pointer, selector.getSelection(), x, y);
        }
        else
        {
          this.moveNodeTo(pointer, target, x, y);
        }
        return true;
      }
      //Continue to move edge vertex
      else if (targetType === 'edge')
      {
        this.moveEdgeTo(pointer, target, x, y);
        return true;
      }
      //Continue to move edge endpoint
      else if (targetType === 'endpoint')
      {
        this.moveEndpointTo(pointer, target, x, y);
        return true;
      }
      //Continue to move initial
      else if (targetType === 'initial')
      {
        //Move initial marker to node or pointer
        const dst = pointer.getNodeAt(x, y) || pointer;
        this.ghostInitialMarker = dst;
        return true;
      }
      //Continue to move graph
      else if (targetType === 'none')
      {
        //Move graph
        const dx = x - this.prevX;
        const dy = y - this.prevY;
        pointer.setOffset(pointer.offsetX + dx, pointer.offsetY + dy, true);
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
      const selector = this.selector;
      //If the selection box is active...
      if (selector.isActive())
      {
        //Update the selection box
        this.selector.updateSelection(x, y);
        return true;
      }

      //Otherwise, don't do anything. Cause even action drags will become move drags.
    }

    return false;
  }

  onDragStop(inputController, x, y, target, targetType)
  {
    const pointer = inputController.getPointer();

    //If is in move mode...
    if (pointer.isMoveMode())
    {
      //If stopped dragging a node...
      if (targetType === 'node')
      {
        //Delete it if withing trash area...
        if (pointer.isTrashMode(x, y))
        {
          //If there exists selected states, delete them all!
          const selector = this.selector;
          if (selector.hasSelection())
          {
            this.deleteSelectedNodes(target);
          }
          else
          {
            //Delete a single node
            this.deleteTargetNode(target);
          }

          return true;
        }
        //If dragged to an empty space (not trash)
        else
        {
          //Do nothing, since should have moved to position
          if (this.selector.hasSelection())
          {
            const dx = x - this.prevX;
            const dy = y - this.prevY;
            this.emit("nodeMoveAll", this.selector.getSelection(), dx, dy);
          }
          else
          {
            this.emit("nodeMove", target, x, y, this.prevX, this.prevY);
          }
          return true;
        }
      }
      //If stopped dragging a edge...
      else if (targetType === 'edge')
      {
        //Delete it if withing trash area...
        if (pointer.isTrashMode(x, y))
        {
          this.deleteTargetEdge(target);
        }
        else
        {
          //Do nothing, since should have moved to position
          this.emit("edgeMove", target, target.getQuadratic(), this.prevQuad);
        }
        return true;
      }
      //If stopped dragging a endpoint...
      else if (targetType === 'endpoint')
      {
        //Delete it if withing trash area...
        if (pointer.isTrashMode(x, y))
        {
          this.deleteTargetEdge(target);
          return true;
        }
        //If hovering over a node...
        else if (target.to instanceof Node)
        {
          const targetNode = target.to;

          //TODO: this is the same in graph.newEdge
          //Look for an existing edge with similar from and to
          for(const edge of this.graph.edges)
          {
            if (edge !== target && edge.from === target.from && edge.to === pointer.target)
            {
              let result = edge.label.split(",");
              if (target.label !== Config.STR_TRANSITION_DEFAULT_LABEL)
              {
                result = result.concat(target.label.split(","));
              }

              //Allow the user to edit the merged labels
              this.openLabelEditor(edge, x, y, result.join(","), false);

              //Delete the merged label
              this.graph.deleteEdge(target);
              return true;
            }
          }

          //If the edge has changed...
          if (this.prevEdgeTo !== null)
          {
            //Make sure that it's previous edge was not null
            target._to = this.prevEdgeTo;
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

            for(const node of this.graph.nodes)
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
              target.copyQuadraticsFrom(this.prevQuad);
            }
          }

          if (this.isNewEdge)
          {
            //Moved below to allow openLabelEditor to check it...
            //this.isNewEdge = false;

            //Emit event
            this.emit("userCreateEdge", this.graph, target);
          }
          else if (this.prevEdgeTo !== null)
          {
            //Emit event
            this.emit("edgeDestination", target, target.to, this.prevEdgeTo, this.prevQuad);
          }

          //TODO: this is the same in graph.newEdge
          //Bend away if there is another edge not bent with the same src/dst
          for(const edge of this.graph.edges)
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
              this.openLabelEditor(target, x, y, null, true, () => {
                this.emit("userPostCreateEdge", this.graph, target);
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
            this.graph.deleteEdge(target);
            return true;
          }
          //Keep edges as placeholders (used in DFA's)
          else
          {
            target.makePlaceholder();

            //Open label editor if default edge...
            if (target.label === Config.STR_TRANSITION_DEFAULT_LABEL)
            {
              this.openLabelEditor(target, x, y);
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
          const prevInitial = this.graph.getStartNode();

          //Set the new object as the initial node
          this.graph.setStartNode(this.ghostInitialMarker);

          //Emit event
          this.emit("nodeInitial", this.ghostInitialMarker, prevInitial);
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
      if (this.selector.isActive())
      {
        //Stop selecting stuff, fool.
        this.selector.endSelection(x, y);
        return true;
      }
    }

    return false;
  }
}
//Mixin Eventable
Eventable.mixin(GraphController);

function moveNodesOutOfEdges(target, graph)
{

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

  for(const node of graph.nodes)
  {
    if(node === target.from || node === target.to) continue;

    const x0 = node.x;
    const y0 = node.y;

    const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
    const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
    if(dist01sq > dist12sq || dist02sq > dist12sq) continue;


    let dist = 0;
    let xint = 0;
    let yint = 0;
    let m0 = 0;
    let horizontal = false;
    if(vertical) {
      dist = Math.abs(x1-x0);
      xint = x1;
      yint = y0;
      m0 = 0;
    } else {
      dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
      xint = (x0 + m*y0 - m*b) / (m*m + 1);
      yint = m * xint + b;
      if(m !== 0) {
        m0 = 1 / m;
      } else {
        horizontal = true;
      }
    }

    if(dist < Config.NODE_RADIUS) {
      const toMove = Config.NODE_RADIUS - dist + 10;
      const distx = x0 - xint;
      const disty = y0 - yint;
      let signx = -1;
      let signy = -1;
      if(distx > 0) signx = 1;
      if(disty > 0) signy = 1;

      if(horizontal) {
        node.y = y0 + signy * toMove;
      } else {
        let toMovex = toMove / Math.sqrt(m0*m0 + 1);
        let toMovey = Math.abs(m0) * toMovex;
        node.x = x0 + signx * toMovex;
        node.y = y0 + signy * toMovey;
      }
    }
  }
}

export default GraphController;
