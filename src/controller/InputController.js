import Eventable from 'util/Eventable.js';
import * as Config from 'config.js';

import GraphPointer from './GraphPointer.js';

class InputController
{
  constructor()
  {
    this.graph = null;
    this.workspace = null;
    this.labelEditor = null;

    this.pointer = new GraphPointer();

    this.cursor = {
      _mousemove: null,
      _mouseup: null,
      _touchmove: null,
      _touchend: null,
      _timer: null
    }

    //Swap left to right clicks and vice versa on anything else but Macs
    this.swapButtons = false;//TODO: !navigator.platform.startsWith("Mac");

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  initialize(app, workspace)
  {
    //Set the graph
    this.graph = app.graph;
    this.pointer.graph = this.graph;
    this.labelEditor = app.viewport.labelEditor;

    //Prepare the workspace
    this.workspace = workspace;
    this.workspace.addEventListener('contextmenu', this.onContextMenu);

    //Process mouse handlers
    this.workspace.addEventListener('mousedown', this.onMouseDown);
    this.workspace.addEventListener('mousemove', this.onMouseMove);

    //Process touch handlers
    this.workspace.addEventListener('touchstart', this.onTouchStart);
    this.workspace.addEventListener('touchmove', this.onTouchMove);
  }

  destroy()
  {
    this.clearListeners();

    //Prepare the workspace
    this.workspace.removeEventListener('contextmenu', this.onContextMenu);

    //Process mouse handlers
    this.workspace.removeEventListener('mousedown', this.onMouseDown);
    this.workspace.removeEventListener('mousemove', this.onMouseMove);

    //Process touch handlers
    this.workspace.removeEventListener('touchstart', this.onTouchStart);
    this.workspace.removeEventListener('touchmove', this.onTouchMove);
  }

  onContextMenu(e)
  {
    e.stopPropagation();
    e.preventDefault();

  onTouchMove(e)
  {
    const mouse = getMousePosition(this.workspace, e.touches[0]);
    this.pointer.setPosition(mouse.x, mouse.y);
  }

  onTouchStart(e)
  {
    if (e.changedTouches.length == 2)
    {
      //2 touches...
    }
    else if (e.changedTouches.length == 1)
    {
      e.stopPropagation();
      e.preventDefault();

      document.activeElement.blur();
      this.workspace.focus();

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
    else
    {
      //Do nothin.
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

    document.activeElement.blur();
    this.workspace.focus();

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

    let moveMode = (e.button == 2);
    if (this.doInputDown(e.clientX, e.clientY, this.swapButtons ? !moveMode : moveMode))
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
    const mouse = getMousePosition(this.workspace, x, y);
    pointer.moveMode = moveMode;//If right click
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
Eventable.mixin(InputController);

function getMousePosition(svg, x, y)
{
  const ctm = svg.getScreenCTM();
  return {
    x: (x - ctm.e) / ctm.a,
    y: (y - ctm.f) / ctm.d
  };
}

export default InputController;
