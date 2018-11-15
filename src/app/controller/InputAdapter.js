import Config from 'config.js';

class InputAdapter
{
  constructor(controller)
  {
    this.controller = controller;
    this.workspace = null;

    this._cursor = {
      _mousemove: null,
      _mouseup: null,
      _touchmove: null,
      _touchend: null,
      _timer: null
    };

    this._dragging = false;

    this.prevPinchDist = 0;
    this.pinchDist = 0;

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  initialize(app)
  {
    //Prepare the workspace
    this.workspace = app.workspace.ref;

    //Process mouse handlers
    this.workspace.addEventListener('mousedown', this.onMouseDown);
    this.workspace.addEventListener('mousemove', this.onMouseMove);
    this.workspace.addEventListener('contextmenu', this.onContextMenu);
    this.workspace.addEventListener('wheel', this.onWheel);

    //Process touch handlers
    this.workspace.addEventListener('touchstart', this.onTouchStart);
    this.workspace.addEventListener('touchmove', this.onTouchMove);
  }

  destroy()
  {
    //Process mouse handlers
    this.workspace.removeEventListener('mousedown', this.onMouseDown);
    this.workspace.removeEventListener('mousemove', this.onMouseMove);
    this.workspace.removeEventListener('contextmenu', this.onContextMenu);
    this.workspace.removeEventListener('wheel', this.onWheel);

    //Process touch handlers
    this.workspace.removeEventListener('touchstart', this.onTouchStart);
    this.workspace.removeEventListener('touchmove', this.onTouchMove);
  }

  isDragging()
  {
    return this._dragging;
  }

  onContextMenu(e)
  {
    e.stopPropagation();
    e.preventDefault();

    return false;
  }

  onWheel(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const pointer = this.controller._pointer;
    const viewport = this.controller.getViewport();

    this.pinchDist = e.deltaY * Config.SCROLL_SENSITIVITY;
    viewport.addScale(this.pinchDist);
  }

  onTouchMove(e)
  {
    const pointer = this.controller._pointer;
    const touch = e.touches[0];
    const mouse = this.controller.getViewport().transformScreenToView(touch.clientX, touch.clientY);
    pointer.setPosition(mouse.x, mouse.y);
  }

  onTouchStart(e)
  {
    if (e.changedTouches.length == 2)
    {
    /*
      e.stopPropagation();
      e.preventDefault();

      document.activeElement.blur();
      this.workspace.focus();

      if (this._cursor._touchmove)
      {
        document.removeEventListener('touchmove', this._cursor._touchmove);
        this._cursor._touchmove = null;
      }
      if (this._cursor._touchend)
      {
        document.removeEventListener('touchend', this._cursor._touchend);
        this._cursor._touchend = null;
      }

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.prevPinchDist = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY);

      this._cursor._touchmove = this.onPinchMove.bind(this);
      this._cursor._touchend = this.onPinchEnd.bind(this);

      document.addEventListener('touchmove', this._cursor._touchmove);
      document.addEventListener('touchend', this._cursor._touchend);
      */

      return false;
    }

    if (e.touches.length == 1)
    {
      e.stopPropagation();
      e.preventDefault();

      document.activeElement.blur();
      this.workspace.focus();

      const touch = e.changedTouches[0];

      if (this._cursor._touchmove)
      {
        document.removeEventListener('touchmove', this._cursor._touchmove);
        this._cursor._touchmove = null;
      }
      if (this._cursor._touchend)
      {
        document.removeEventListener('touchend', this._cursor._touchend);
        this._cursor._touchend = null;
      }

      let moveMode = false;
      moveMode = this.controller.getInputScheme() ? !moveMode : moveMode;
      if (this.doInputDown(touch.clientX, touch.clientY, moveMode/* false */))//default false
      {
        this._cursor._touchmove = this.onTouchStartAndMove.bind(this);
        this._cursor._touchend = this.onTouchStartAndEnd.bind(this);

        document.addEventListener('touchmove', this._cursor._touchmove);
        document.addEventListener('touchend', this._cursor._touchend);
      }
    }
    else
    {
      //Do nothin.
    }
  }

  onPinchMove(e)
  {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    this.pinchDist = Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY);

    this.controller.getViewport().setScale(this.pinchDist * PINCH_SENSITIVITY);

    return false;
  }

  onPinchEnd()
  {
    if (this._cursor._touchmove)
    {
      document.removeEventListener('touchmove', this._cursor._touchmove);
      this._cursor._touchmove = null;
    }
    if (this._cursor._touchend)
    {
      document.removeEventListener('touchend', this._cursor._touchend);
      this._cursor._touchend = null;
    }

    return false;
  }

  onTouchStartAndEnd(e)
  {
    const touch = e.changedTouches[0];

    if (this._cursor._touchmove)
    {
      document.removeEventListener('touchmove', this._cursor._touchmove);
      this._cursor._touchmove = null;
    }
    if (this._cursor._touchend)
    {
      document.removeEventListener('touchend', this._cursor._touchend);
      this._cursor._touchend = null;
    }

    this.doInputDownAndUp(touch.clientX, touch.clientY);

    return false;
  }

  onTouchStartAndMove(e)
  {
    const touch = e.changedTouches[0];
    this.doInputDownAndMove(touch.clientX, touch.clientY);

    return false;
  }

  onMouseMove(e)
  {
    const pointer = this.controller._pointer;
    const picker = this.controller._picker;

    const mouse = this.controller.getViewport().transformScreenToView(e.clientX, e.clientY);
    pointer.setPosition(mouse.x, mouse.y);

    //Update target
    picker.updateTarget(pointer.x, pointer.y);

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

  onMouseDown(e)
  {
    e.stopPropagation();
    e.preventDefault();

    document.activeElement.blur();
    this.workspace.focus();

    if (this._cursor._mousemove)
    {
      document.removeEventListener('mousemove', this._cursor._mousemove);
      this._cursor._mousemove = null;
    }
    if (this._cursor._mouseup)
    {
      document.removeEventListener('mouseup', this._cursor._mouseup);
      this._cursor._mouseup = null;
    }

    let moveMode = (e.button == 2) || e.ctrlKey;
    moveMode = this.controller.getInputScheme() ? !moveMode : moveMode;
    if (this.doInputDown(e.clientX, e.clientY, moveMode))
    {
      this._cursor._mousemove = this.onMouseDownAndMove.bind(this);
      this._cursor._mouseup = this.onMouseDownAndUp.bind(this);

      document.addEventListener('mousemove', this._cursor._mousemove);
      document.addEventListener('mouseup', this._cursor._mouseup);
    }
  }

  onMouseDownAndMove(e)
  {
    e.stopPropagation();
    e.preventDefault();

    this.doInputDownAndMove(e.clientX, e.clientY);

    return false;
  }

  onMouseDownAndUp(e)
  {
    e.stopPropagation();
    e.preventDefault();

    if (this._cursor._mousemove)
    {
      document.removeEventListener('mousemove', this._cursor._mousemove);
      this._cursor._mousemove = null;
    }
    if (this._cursor._mouseup)
    {
      document.removeEventListener('mouseup', this._cursor._mouseup);
      this._cursor._mouseup = null;
    }

    this.doInputDownAndUp(e.clientX, e.clientY);

    return false;
  }

  doInputDown(x, y, moveMode)
  {
    const pointer = this.controller._pointer;
    const picker = this.controller._picker;

    const mouse = this.controller.getViewport().transformScreenToView(x, y);
    pointer.setPosition(mouse.x, mouse.y);

    this._dragging = false;

    pointer.moveMode = moveMode;//If right click
    pointer.beginAction();
    picker.updateTarget(pointer.x, pointer.y);
    picker.setInitialTarget(picker.target, picker.targetType);


    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //Check whether to accept the start of input...
    const event = {result: true};
    this.controller.emit("inputdown", this.controller, pointer.x, pointer.y,
      target, targetType, event);

    this._cursor._timer = setTimeout(() => {
      if (!this._dragging)
      {
        pointer.moveMode = this.controller.getInputScheme() ? false : true;//default true
      }
    }, Config.LONG_TAP_TICKS);

    return event.result;
  }

  doInputDownAndMove(x, y)
  {
    const pointer = this.controller._pointer;
    const picker = this.controller._picker;

    const mouse = this.controller.getViewport().transformScreenToView(x, y);
    pointer.setPosition(mouse.x, mouse.y);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (!this._dragging)
    {
      if (pointer.getDistanceSquToInitial() > pointer.getDraggingRadiusSqu())
      {
        //Start drag!
        this._dragging = true;
        this.controller.emit("dragstart", this.controller, pointer.x, pointer.y,
            target, targetType);
      }
      else
      {
        //Still a click or hold
        this._dragging = false;
      }
    }
    else
    {
      //Continue to drag...
      this.controller.emit("dragmove", this.controller, pointer.x, pointer.y,
          target, targetType);
    }

    this.controller.emit("inputmove", this.controller, pointer.x, pointer.y,
        target, targetType);
  }

  doInputDownAndUp(x, y)
  {
    if (this._cursor._timer)
    {
      clearTimeout(this._cursor._timer);
      this._cursor._timer = null;
    }

    const picker = this.controller._picker;
    const pointer = this.controller._pointer;
    picker.updateTarget(pointer.x, pointer.y);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (this._dragging)
    {
      //Stop drag!
      this.controller.emit("dragstop", this.controller, pointer.x, pointer.y,
          target, targetType);
    }
    else
    {
      //Tap!
      this.controller.emit("inputaction", this.controller, pointer.x, pointer.y,
          target, targetType);
    }

    this.controller.emit("inputup", this.controller, pointer.x, pointer.y,
        target, targetType);

    //Set target as nothing since no longer interacting
    picker.clearTarget();

    pointer.endAction();
  }
}

export default InputAdapter;
