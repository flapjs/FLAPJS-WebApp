import Eventable from 'util/Eventable.js';
import * as Config from 'config.js';

import GraphPointer from './GraphPointer.js';

class InputController
{
  constructor()
  {
    this.graph = null;
    this.workspace = null;

    this.pointer = new GraphPointer();

    this.cursor = {
      _mousemove: null,
      _mouseup: null,
      _touchmove: null,
      _touchend: null,
      _timer: null
    }
  }

  initialize(app, workspace)
  {
    //Set the graph
    this.graph = app.graph;
    this.pointer.graph = this.graph;

    //Prepare the workspace
    this.workspace = workspace;
    this.workspace.addEventListener('contextmenu', this.onContextMenu.bind(this));

    //Process mouse handlers
    this.workspace.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.workspace.addEventListener('mousemove', this.onMouseMove.bind(this));

    //Process touch handlers
    this.workspace.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.workspace.addEventListener('touchmove', this.onTouchMove.bind(this));
  }

  onUpdate(dt)
  {

  }

  onContextMenu(e)
  {
    e.stopPropagation();
    e.preventDefault();
  }

  onTouchMove(e)
  {
    const mouse = getMousePosition(this.workspace, e.touches[0]);
    this.pointer.setPosition(mouse.x, mouse.y);
  }

  onTouchStart(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const touch = e.changedTouches[0];

    if (this.cursor._touchmove)
    {
      document.removeEventListener('touchmove', this.cursor._touchmove);
      this.cursor._touchmove = null;
    }
    if (this.cursor._touchend)
    {
      document.removeEventListener('touchend', this.cursor._touchend);
      this.cursor._touchend = null;
    }

    if (this.doInputDown(touch.clientX, touch.clientY, false))
    {
      this.cursor._touchmove = this.onTouchStartAndMove.bind(this);
      this.cursor._touchend = this.onTouchStartAndEnd.bind(this);

      document.addEventListener('touchmove', this.cursor._touchmove);
      document.addEventListener('touchend', this.cursor._touchend);
    }
  }

  onTouchStartAndEnd(e)
  {
    const touch = e.changedTouches[0];

    if (this.cursor._touchmove)
    {
      document.removeEventListener('touchmove', this.cursor._touchmove);
      this.cursor._touchmove = null;
    }
    if (this.cursor._touchend)
    {
      document.removeEventListener('touchend', this.cursor._touchend);
      this.cursor._touchend = null;
    }

    this.doInputDownAndUp(touch.clientX, touch.clientY);
  }

  onTouchStartAndMove(e)
  {
    const touch = e.changedTouches[0];
    this.doInputDownAndMove(touch.clientX, touch.clientY);
  }

  onMouseMove(e)
  {
    const mouse = getMousePosition(this.workspace, e);
    this.pointer.setPosition(mouse.x, mouse.y);
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

    if (this.doInputDown(e.clientX, e.clientY, e.button == 2))
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

    this.doInputDownAndMove(e.clientX, e.clientY);
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

    this.doInputDownAndUp(e.clientX, e.clientY)
  }

  doInputDown(x, y, moveMode)
  {
    const pointer = this.pointer;
    pointer.moveMode = moveMode;//If right click
    const mouse = getMousePosition(this.workspace, x, y);
    pointer.setInitialPosition(mouse.x, mouse.y);

    //Check whether to accept the start of input...
    this.onInputDown(pointer.x, pointer.y,
      pointer.initial.target, pointer.initial.targetType);

    this.cursor._timer = setTimeout(() => {
      if (pointer.isWaitingForMoveMode())
      {
        pointer.moveMode = true;
      }
    }, Config.LONG_TAP_TICKS);
    
    return true;
  }

  doInputDownAndMove(x, y)
  {
    const pointer = this.pointer;
    pointer.updateTarget();

    const mouse = getMousePosition(this.workspace, x, y);
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

  doInputDownAndUp(x, y)
  {
    if (this.cursor._timer)
    {
      clearTimeout(this.cursor._timer);
      this.cursor._timer = null;
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

function getMousePosition(svg, x, y)
{
  const ctm = svg.getScreenCTM();
  return {
    x: (x - ctm.e) / ctm.a,
    y: (y - ctm.f) / ctm.d
  };
}

export default InputController;
