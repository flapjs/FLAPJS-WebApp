import Eventable from 'util/Eventable.js';
import * as Config from 'config.js';

import GraphPointer from './GraphPointer.js';

class InputController
{
  constructor(graph)
  {
    this.graph = graph;
    this.workspace = null;

    this.pointer = new GraphPointer(this.graph);

    this.cursor = {
      _mousemove: null,
      _mouseup: null
    }
  }

  initialize(app, workspace)
  {
    this.workspace = workspace;
    this.workspace.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.workspace.addEventListener('contextmenu', this.onContextMenu.bind(this));
    this.workspace.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onUpdate(dt)
  {

  }

  onMouseMove(e)
  {
    const mouse = getMousePosition(this.workspace, e);
    this.pointer.setPosition(mouse.x, mouse.y);
  }

  onContextMenu(e)
  {
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseDown(e)
  {
    e.stopPropagation();
    e.preventDefault();

    if (this.cursor._mousemove)
    {
      document.removeEventListener('mousemove', this.cursor._mousemove);
      this.cursor._mousemove = null;
    }
    if (this.cursor._mouseup)
    {
      document.removeEventListener('mouseup', this.cursor._mouseup);
      this.cursor._mouseup = null;
    }

    const pointer = this.pointer;
    pointer.moveMode = (e.button == 2);//If right click
    const mouse = getMousePosition(this.workspace, e);
    pointer.setInitialPosition(mouse.x, mouse.y);

    //Check whether to accept the start of input...
    if (this.onInputDown(pointer.x, pointer.y,
      pointer.initial.target, pointer.initial.targetType))
    {
      this.cursor._mousemove = this.onMouseDownAndMove.bind(this);
      this.cursor._mouseup = this.onMouseDownAndUp.bind(this);

      document.addEventListener('mousemove', this.cursor._mousemove);
      document.addEventListener('mouseup', this.cursor._mouseup);
    }
  }

  onMouseDownAndMove(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const pointer = this.pointer;
    pointer.updateTarget();

    const mouse = getMousePosition(this.workspace, e);
    pointer.setPosition(mouse.x, mouse.y);

    if (!pointer.dragging)
    {
      if (pointer.getDistanceSquToInitial() > pointer.getDraggingRadiusForTarget())
      {
        //Start drag!
        pointer.dragging = true;
        this.onDragStart(pointer.x, pointer.y,
          pointer.initial.target, pointer.initial.targetType);
      }
      else
      {
        //Still a click or hold
        pointer.dragging = false;
      }
    }
    else
    {
      //Continue to drag...
      this.onDragMove(pointer.x, pointer.y,
        pointer.initial.target, pointer.initial.targetType);
    }

    this.onInputMove(pointer.x, pointer.y,
      pointer.initial.target, pointer.initial.targetType);
  }

  onMouseDownAndUp(e)
  {
    e.stopPropagation();
    e.preventDefault();

    if (this.cursor._mousemove)
    {
      document.removeEventListener('mousemove', this.cursor._mousemove);
      this.cursor._mousemove = null;
    }
    if (this.cursor._mouseup)
    {
      document.removeEventListener('mouseup', this.cursor._mouseup);
      this.cursor._mouseup = null;
    }

    const pointer = this.pointer;
    pointer.updateTarget();

    if (pointer.dragging)
    {
      //Stop drag!
      this.onDragStop(pointer.x, pointer.y,
        pointer.initial.target, pointer.initial.targetType);
    }
    else
    {
      //Tap!
      this.onInputAction(pointer.x, pointer.y,
        pointer.initial.target, pointer.initial.targetType);
    }

    this.onInputUp(pointer.x, pointer.y,
      pointer.initial.target, pointer.initial.targetType);
  }

  //Returns true if should act on input, false to ignore remaining click events
  onInputDown(x, y, target, targetType)
  {
    return true;
  }

  onInputMove(x, y, target, targetType) {}
  onInputUp(x, y, target, targetType) {}
  onInputAction(x, y, target, targetType) {}

  onDragStart(x, y, target, targetType) {}
  onDragMove(x, y, target, targetType) {}
  onDragStop(x, y, target, targetType) {}
}
//Mixin Eventable
Object.assign(InputController.prototype, Eventable);

function getMousePosition(svg, ev)
{
  const ctm = svg.getScreenCTM();
  return {
    x: (ev.clientX - ctm.e) / ctm.a,
    y: (ev.clientY - ctm.f) / ctm.d
  };
}

export default InputController;
