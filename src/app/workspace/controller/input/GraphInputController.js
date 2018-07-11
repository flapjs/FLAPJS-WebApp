import InputController from './InputController.js';
import LabelEditor from '../LabelEditor.js';

import * as Config from 'config.js';

class GraphInputController extends InputController
{
  constructor(graph)
  {
    super(graph);

    //this.labelEditor = new LabelEditor();

    this.prevTarget = { x: 0, y: 0 };
    this.graphTarget = { x: 0, y: 0 };
    this.quadTarget = { x: 0, y: 0 };

    this.selectBox = { x:0, y: 0, mx: 0, my: 0, targets: [] };
    this.isSelecting = false;

    this.hoverTarget = null;
    this.hoverType = null;

    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
    //TODO: Trash area should NOT show up on exported image!
    this.trashArea = { x: Config.TRASH_AREA_POSX, y: Config.TRASH_AREA_POSY,
                        width: Config.TRASH_AREA_WIDTH, height: Config.TRASH_AREA_HEIGHT };
  }

  onUpdate(dt)
  {
    const x = this.pointer.x;
    const y = this.pointer.y;

    //Get hover target
    this.hoverTarget = null;
    if (this.hoverTarget = this.pointer.getNodeAt(x, y))
    {
      this.hoverType = "node";
    }
    else if (this.hoverTarget = this.pointer.getEdgeAt(x, y))
    {
      this.hoverType = "edge";
    }
    else if (this.hoverTarget = this.pointer.getEdgeByEndPointAt(x, y))
    {
      this.hoverType = "endpoint";
    }
  }

  onInputDown(x, y, target, targetType)
  {
    if (this.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !this.selectBox.targets.includes(target))
      {
        this.clearSelection();
      }
    }
  }

  onInputMove(x, y, target, targetType) {}
  onInputUp(x, y, target, targetType) {}

  onInputAction(x, y, target, targetType)
  {
    if (this.pointer.moveMode)
    {
      return false;
    }
    else
    {
      if (targetType == "node")
      {
        //Toggle accept for selected node
        target.accept = !target.accept;
        return true;
      }
      else if (targetType == "edge")
      {
        //Edit label for selected edge
        this.openLabelEditor(target);
        return true;
      }
      else if (target == null)
      {
        //Create state at position
        this.createNode(x, y);
        return true;
      }
      else
      {
        return false;
      }
    }
  }

  onDragStart(x, y, target, targetType)
  {
    if (this.pointer.moveMode)
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
      const edge = this.createEdge(target, null, Config.STR_TRANSITION_PROXY_LABEL);
      this.graph.proxyEdge = edge;
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

  onDragMove(x, y, target, targetType)
  {
    if (this.pointer.moveMode)
    {
      if (target != null)
      {
        this.moveTarget(target, targetType, x, y);
        return true;
      }

      return false;
    }
    else if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection();
      return true;
    }

    return false;
  }

  onDragStop(x, y, target, targetType)
  {
    if (this.pointer.moveMode)
    {
      let result = false;
      if (target != null)
      {
        result = this.moveTarget(target, targetType, x, y);
        if (targetType == "endpoint")
        {
          if (!result)
          {
            //Destroy any edge that no longer have a destination
            if (this.shouldDestroyPointlessEdges)
            {
              this.graph.deleteEdge(target);
            }
            //Keep edges as placeholders (used in DFA's)
            else
            {
              //But delete it if withing trash area...
              if (this.isWithinTrash(x, y))
              {
                this.graph.deleteEdge(target);
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
                this.graph.deleteNode(select);
              }
              this.clearSelection();
            }
            //Delete a single node
            else
            {
              this.graph.deleteNode(target);
            }

            return true;
          }
        }
      }
      else
      {
        result = this.moveTarget(this.graphTarget, "graph", x, y);
      }

      return result;
    }
    else if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection();
      this.isSelecting = false;
      return true;
    }

    return false;
  }

  createNode(x, y)
  {
    const node = this.graph.newNode(x, y, Config.STR_STATE_LABEL + (this.graph.nodes.length));
    node.x = x || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    node.y = y || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    return node;
  }

  createEdge(src, dst, label=Config.STR_TRANSITION_DEFAULT_LABEL)
  {
    const edge = this.graph.newEdge(src, dst, label);
    return edge;
  }

  openLabelEditor(target, placeholder=null)
  {
    //this.labelEditor.open(target, placeholder);
  }

  startMove(target, targetType)
  {
    this.pointer.moveMode = true;

    this.pointer.initial.target = target;
    this.pointer.initial.targetType = targetType;

    //TODO: this should really be in moveCursor, but moveMode needs to be here...
    if (targetType == "endpoint")
    {
      //TODO: Do not allow user to create quadratics on placeholder edges
      this.quadTarget.x = target.quad.x;
      this.quadTarget.y = target.quad.y;
    }

    this.moveTarget(target, targetType, this.pointer.x, this.pointer.y);
  }

  stopMove()
  {
    this.pointer.moveMode = false;

    //TODO: is this where it needs to be?
    this.graph.proxyEdge = null;
  }

  isWithinTrash(x, y)
  {
    const dx = x - this.trashArea.x;
    const dy = y - this.trashArea.y;
    return dx > 0 && dx < this.trashArea.width &&
            dy > 0 && dy < this.trashArea.height;
  }

  moveTarget(target, targetType, x, y)
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
        target.x = x;
        target.y = y;
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
      const dst = this.pointer.getNodeAt(x, y);
      if (dst)
      {
        target.to = dst;
        result = true;
      }
      else
      {
        target.to = this.pointer;
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
          target.quad.x = 0;
          target.quad.y = 0;
        }
      }

      return result;
    }
    else if (targetType == "graph")
    {
      //Move the graph if draggin empty...
      //this.graph.offsetX = x - target.x;
      //this.graph.offsetY = y - target.y;
      return true;
    }

    return false;
  }

  getSelection()
  {
    if (this.isSelecting)
    {
      const mx = Math.max(this.selectBox.mx, this.selectBox.x);
      const my = Math.max(this.selectBox.my, this.selectBox.y);
      const lx = Math.min(this.selectBox.mx, this.selectBox.x);
      const ly = Math.min(this.selectBox.my, this.selectBox.y);
      this.clearSelection();
      getNodesWithin(this.graph, lx, ly, mx, my, this.selectBox.targets);
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

function getNodesWithin(graph, x1, y1, x2, y2, dst)
{
  const fromX = Math.min(x1, x2);
  const fromY = Math.min(y1, y2);
  const toX = Math.max(x1, x2);
  const toY = Math.max(y1, y2);

  for(const node of graph.nodes)
  {
    if (node.x >= fromX && node.x < toX &&
        node.y >= fromY && node.y < toY)
    {
      dst.push(node);
    }
  }
  return dst;
}

export default GraphInputController;
