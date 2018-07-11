import LabelEditor from 'controller/LabelEditor.js';
import GraphCursor from 'controller/GraphCursor.js';

import * as Config from 'config.js';

/*
onSingleTap
  Edit Mode
    OnState
      - Toggle target acceptState
    OnEdge
      - Edit label

onDoubleTap
  Edit Mode
    OnEmpty
      - Create new state at position

onStartDragging
  Edit Mode
    OnState
      - Create new edge, and move enter move mode for its endpoint
    OnEmpty
      - Begin selection box
  Move Mode
    OnState
      - Set drag target to state
    OnEdge
      - Set drag target to edge
    OnEdgeEndPoint
      - Set drag target to edge endpoint
    OnEmpty
      - Set drag target to graph

OnDragging
  Draw drag targets
  Draw selection box

onStopDragging
  Edit Mode
    - Mark all selected targets in selection box (save position to all targets)
  Move Mode
    OnState
      If is selected state:
        - Drag the marked targets to cursor, while maintaining interdistance
      Otherwise:
        - Drag the state to cursor
    OnEdge
      - Drag the edge to cursor
    OnEdgeEndPoint
      - Drag the endpoint of edge to cursor
    OnEmpty
      - Drag the graph to cursor

NOTES:
- Dragging does not start until cursor leaves the object it is dragging (or is in move mode?)
*/
class MainCursorController
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;

    this.cursor = new GraphCursor(graph, mouse);
    this.labelEditor = new LabelEditor();

    this.prevTarget = { x: 0, y: 0 };
    this.graphTarget = { x: 0, y: 0 };
    this.quadTarget = { x: 0, y: 0 };

    this.selectBox = { x:0, y: 0, mx: 0, my: 0, targets: [] };
    this.isSelecting = false;

    this.moveMode = false;

    this.tap = { x: 0, y: 0 };
    this.doubleTapTicks = 0;
    this.isDown = false;
    this.isDragging = false;

    this.target = null;
    this.targetType = null;

    this.hoverTarget = null;
    this.hoverType = null;

    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
    //TODO: Trash area should NOT show up on exported image!
    this.trashArea = { x: Config.TRASH_AREA_POSX, y: Config.TRASH_AREA_POSY,
                        width: Config.TRASH_AREA_WIDTH, height: Config.TRASH_AREA_HEIGHT };
  }

  load()
  {
    this.mouse.on('mousedown', this.onMouseDown.bind(this));
    this.mouse.on('mouseup', this.onMouseUp.bind(this));
    this.mouse.on('mouseexit', this.onMouseExit.bind(this));
    this.mouse.on('mousemove', this.onMouseMove.bind(this));
  }

  update(dt)
  {
    if (this.doubleTapTicks > 0)
    {
      --this.doubleTapTicks;
    }

    const x = this.mouse.x;
    const y = this.mouse.y;

    //Get hover target
    this.hoverTarget = null;
    if (this.hoverTarget = this.target)
    {
      this.hoverTarget = this.target;
      this.hoverType = this.targetType;
    }
    else if (this.hoverTarget = this.cursor.getNodeAt(x, y))
    {
      this.hoverType = "node";
    }
    else if (this.hoverTarget = this.cursor.getEdgeAt(x, y))
    {
      this.hoverType = "edge";
    }
    else if (this.hoverTarget = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.hoverType = "endpoint";
    }
  }

  onMouseDown(mouse, button)
  {
    this.moveMode = (button == 3);

    const mx = this.tap.x = mouse.x;
    const my = this.tap.y = mouse.y;
    this.isDown = true;
    this.isDragging = false;

    if (this.target = this.cursor.getNodeAt(mx, my))
    {
      this.targetType = "node";
    }
    else if (this.target = this.cursor.getEdgeAt(mx, my))
    {
      this.targetType = "edge";
    }
    else if (this.target = this.cursor.getEdgeByEndPointAt(mx, my))
    {
      this.targetType = "endpoint";
    }
    else
    {
      this.target = null;
      this.targetType = null;
    }

    if (this.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (this.targetType != "node" || !this.selectBox.targets.includes(this.target))
      {
        this.clearSelection();
      }
    }
  }

  onMouseUp(mouse, button)
  {
    const mx = mouse.x;
    const my = mouse.y;
    this.isDown = false;

    if (this.isDragging)
    {
      this.doStopDragging(this.cursor, mx, my, this.target, this.targetType);
      this.isDragging = false;
    }
    else if (this.doubleTapTicks > 0)
    {
      if (!this.doDoubleTap(this.cursor, mx, my, this.target, this.targetType))
      {
        this.doSingleTap(this.cursor, mx, my, this.target, this.targetType);
      }
    }
    else
    {
      this.doSingleTap(this.cursor, mx, my, this.target, this.targetType);
      this.doubleTapTicks = Config.DOUBLE_TAP_TICKS;
    }

    this.target = null;
    this.targetType = null;
  }

  onMouseMove(mouse, x, y)
  {
    if (this.isDragging)
    {
      this.doDragging(this.cursor, x, y, this.target, this.targetType);
      return;
    }
    if (!this.isDown) return;

    let dx = this.tap.x;
    let dy = this.tap.y;
    let radiusSqu = Config.CURSOR_RADIUS_SQU;

    if (this.target != null)
    {
      if (this.targetType == "node")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = Config.NODE_RADIUS_SQU;
      }
      else if (this.targetType == "edge")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = Config.EDGE_RADIUS_SQU;
      }
      else if (this.targetType == "endpoint")
      {
        const endpoint = this.target.getEndPoint();
        dx = endpoint[0];
        dy = endpoint[1];
        radiusSqu = Config.ENDPOINT_RADIUS_SQU;
      }
    }

    dx -= x;
    dy -= y;
    if (dx * dx + dy * dy >= radiusSqu)
    {
      this.isDragging = true;
      this.doStartDragging(this.cursor, x, y, this.target, this.targetType);
    }
  }

  onMouseExit(mouse)
  {
    const mx = mouse.x;
    const my = mouse.y;

    if (this.isDragging)
    {
      this.doStopDragging(this.cursor, mx, my, this.target, this.targetType);
      this.isDragging = false;
    }

    if (this.isDown)
    {
      this.onMouseUp(mouse, 0);
      this.isDown = false;
    }
  }

  /****************************************************************************/

  /*** ACTIONS ****************************************************************/

  /****************************************************************************/

  doSingleTap(cursor, x, y, target, targetType)
  {
    if (this.moveMode)
    {
      return false;
    }
    else
    {
      if (targetType == "node")
      {
        //Toggle accept for selected node
        this.graph.toggleAcceptState(target);
        return true;
      }
      else if (targetType == "edge")
      {
        //Edit label for selected edge
        this.openLabelEditor(target);
        return true;
      }
      else
      {
        return false;
      }
    }
  }

  doDoubleTap(cursor, x, y, target, targetType)
  {
    if (this.moveMode)
    {
      return false;
    }
    else if (target == null)
    {
      //Create state at position
      this.createNewState(x - this.graph.centerX, y - this.graph.centerY);
      return true;
    }
    else
    {
      return false;
    }
  }

  doStartDragging(cursor, x, y, target, targetType)
  {
    if (this.moveMode)
    {
      if (target != null)
      {
        //Makes sure that placeholders are not quadratics!
        if (targetType == "edge")
        {
          console.log(target.isPlaceholder() + ", " + targetType);
        }

        if (targetType == "edge" && target.isPlaceholder())
        {
          this.stopMove();
          return false;
        }
        //Otherwise...
        else
        {
          this.prevTarget.x = x;
          this.prevTarget.y = y;
          this.startMove(target, targetType);
        }
      }
      else
      {
        this.graphTarget.x = x;
        this.graphTarget.y = y;
        this.startMove(this.graphTarget, "graph");
      }

      return true;
    }
    else if (targetType == "node")
    {
      //Begin creating edge...
      const edge = this.createNewTransition(target, null, Config.STR_TRANSITION_PROXY_LABEL);
      this.startMove(edge, "endpoint");
      return true;
    }
    else if (target == null)
    {
      //Begin selection box...
      this.isSelecting = true;
      this.selectBox.x = x;
      this.selectBox.y = y;
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.clearSelection();
      return true;
    }

    return false;
  }

  doDragging(cursor, x, y, target, targetType)
  {
    if (this.moveMode)
    {
      if (target != null)
      {
        this.moveTarget(cursor, target, targetType, x, y);
        return true;
      }

      return false;
    }
    else if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection(cursor);
      return true;
    }

    return false;
  }

  doStopDragging(cursor, x, y, target, targetType)
  {
    if (this.moveMode)
    {
      let result = false;
      if (target != null)
      {
        result = this.moveTarget(cursor, target, targetType, x, y);
        if (targetType == "endpoint")
        {
          if (!result)
          {
            //Destroy any edge that no longer have a destination
            if (this.shouldDestroyPointlessEdges)
            {
              this.graph.destroyEdge(target);
            }
            //Keep edges as placeholders (used in DFA's)
            else
            {
              //But delete it if withing trash area...
              if (this.isWithinTrash(x, y))
              {
                this.graph.destroyEdge(target);
              }
              //Otherwise, make it a placeholder
              else
              {
                target.makePlaceholder();

                //Open label editor if default edge...
                if (target.label == Config.STR_TRANSITION_PROXY_LABEL)
                {
                  target.label = Config.STR_TRANSITION_DEFAULT_LABEL;
                  this.openLabelEditor(target);
                }
              }
            }
          }
          else
          {
            //Open label editor if default edge...
            if (target.label == Config.STR_TRANSITION_PROXY_LABEL)
            {
              target.label = Config.STR_TRANSITION_DEFAULT_LABEL;
              this.openLabelEditor(target);
            }
          }

          return true;
        }
        else if (targetType == "node")
        {
          //Delete it if withing trash area...
          if (this.isWithinTrash(x, y))
          {
            //If there exists selected states, delete them all!
            if (this.hasSelection())
            {
              for(const select of this.getSelection())
              {
                this.graph.destroyNode(select);
              }
              this.clearSelection();
            }
            //Delete a single node
            else
            {
              this.graph.destroyNode(target);
            }

            return true;
          }
        }
      }
      else
      {
        result = this.moveTarget(cursor, this.graphTarget, "graph", x, y);
      }

      return result;
    }
    else if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection(cursor);
      this.isSelecting = false;
      return true;
    }

    return false;
  }

  createNewState(x, y)
  {
    const node = this.graph.createNewNode(x, y, Config.STR_STATE_LABEL + (this.graph.nodes.length));
    node.x = x || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    node.y = y || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    return node;
  }

  createNewTransition(src, dst, label=Config.STR_TRANSITION_DEFAULT_LABEL)
  {
    const edge = this.graph.createNewEdge(src, dst, label);
    return edge;
  }

  openLabelEditor(target, placeholder=null)
  {
    this.labelEditor.open(target, placeholder);
  }

  startMove(target, targetType)
  {
    this.moveMode = true;

    this.target = target;
    this.targetType = targetType;

    //TODO: this should really be in moveCursor, but moveMode needs to be here...
    if (this.targetType == "endpoint")
    {
      //TODO: Do not allow user to create quadratics on placeholder edges
      const quad = this.target.quad;
      if (quad != null)
      {
        this.quadTarget.x = quad.x;
        this.quadTarget.y = quad.y;
      }
      else
      {
        this.quadTarget.x = 0;
        this.quadTarget.y = 0;
      }
    }

    this.moveTarget(this.cursor, this.target, this.targetType, this.mouse.x, this.mouse.y);
  }

  stopMove()
  {
    this.moveMode = false;
  }

  isWithinTrash(x, y)
  {
    const dx = x - this.trashArea.x;
    const dy = y - this.trashArea.y;
    return dx > 0 && dx < this.trashArea.width &&
            dy > 0 && dy < this.trashArea.height;
  }

  moveTarget(cursor, target, targetType, x, y)
  {
    if (target == null)
    {
      throw new Error("Trying to resolve target mode \'" + targetType + "\' with missing target source");
    }

    if (targetType == "node")
    {
      //If there exists selected states, move them all!
      if (this.hasSelection())
      {
        const dx = x - this.prevTarget.x;
        const dy = y - this.prevTarget.y;
        for(const select of this.getSelection())
        {
          select.nextX += dx;
          select.nextY += dy;
        }
        this.prevTarget.x = x;
        this.prevTarget.y = y;
      }
      //Move a single node
      else
      {
        target.x = x - this.graph.centerX;
        target.y = y - this.graph.centerY;
      }
      return true;
    }
    else if (targetType == "edge")
    {
      target.x = x;
      target.y = y;
      return true;
    }
    else if (targetType == "endpoint")
    {
      let result = true;
      const dst = cursor.getNodeAt(x, y);
      if (dst)
      {
        target.to = dst;
        result = true;
      }
      else
      {
        target.to = cursor.mouse;
        result = false;
      }

      //If the cursor returns to the state after leaving it...
      if (target.isSelfLoop())
      {
        //Make it a self loop
        const dx = target.from.x - x;
        const dy = target.from.y - y;
        const angle = Math.atan2(dy, dx);
        target.x = target.from.x - Math.cos(angle) * Config.SELF_LOOP_HEIGHT;
        target.y = target.from.y - Math.sin(angle) * Config.SELF_LOOP_HEIGHT;
      }
      else
      {
        if (this.quadTarget.x != 0 || this.quadTarget.y != 0)
        {
          target.x = target.y = 1;
          target.quad.x = this.quadTarget.x;
          target.quad.y = this.quadTarget.y;
        }
        else
        {
          target.quad = null;
        }
      }

      return result;
    }
    else if (targetType == "graph")
    {
      //Move the graph if draggin empty...
      this.graph.offsetX = x - target.x;
      this.graph.offsetY = y - target.y;
      return true;
    }

    return false;
  }

  getSelection(cursor)
  {
    if (this.isSelecting)
    {
      const mx = Math.max(this.selectBox.mx, this.selectBox.x);
      const my = Math.max(this.selectBox.my, this.selectBox.y);
      const lx = Math.min(this.selectBox.mx, this.selectBox.x);
      const ly = Math.min(this.selectBox.my, this.selectBox.y);
      this.clearSelection();
      cursor.getNodesWithin(lx, ly, mx, my, this.selectBox.targets);
    }

    return this.selectBox.targets;
  }

  hasSelection()
  {
    return this.selectBox.targets.length > 0;
  }

  clearSelection()
  {
    this.selectBox.targets.length = 0;
  }
}

export default MainCursorController;
