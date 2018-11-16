import Config from 'config.js';

class InputAdapter
{
  constructor(controller)
  {
    this._controller = controller;
    this._element = null;
    this._cursor = {
      _mousemove: null,
      _mouseup: null,
      _touchmove: null,
      _touchend: null,
      _timer: null
    };

    //Although dragging could be in pointer, it should be here to allow
    //the adapter to be independent of pointer.
    this._dragging = false;
    this._altaction = false;

    this.prevPinchDist = 0;
    this.pinchDist = 0;

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  initialize(element)
  {
    //Prepare the workspace
    this._element = element;

    //Process mouse handlers
    this._element.addEventListener('mousedown', this.onMouseDown);
    this._element.addEventListener('mousemove', this.onMouseMove);
    this._element.addEventListener('contextmenu', this.onContextMenu);
    this._element.addEventListener('wheel', this.onWheel);

    //Process touch handlers
    this._element.addEventListener('touchstart', this.onTouchStart);
    this._element.addEventListener('touchmove', this.onTouchMove);
  }

  destroy()
  {
    //Process mouse handlers
    this._element.removeEventListener('mousedown', this.onMouseDown);
    this._element.removeEventListener('mousemove', this.onMouseMove);
    this._element.removeEventListener('contextmenu', this.onContextMenu);
    this._element.removeEventListener('wheel', this.onWheel);

    //Process touch handlers
    this._element.removeEventListener('touchstart', this.onTouchStart);
    this._element.removeEventListener('touchmove', this.onTouchMove);
  }

  isDragging()
  {
    return this._dragging;
  }

  getDraggingRadiusSqu()
  {
    return Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
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

    const pointer = this._controller._pointer;
    const viewport = this._controller.getViewport();

    this.pinchDist = e.deltaY * Config.SCROLL_SENSITIVITY;
    viewport.addScale(this.pinchDist);
  }

  onTouchMove(e)
  {
    const pointer = this._controller._pointer;
    const touch = e.touches[0];
    const mouse = this._controller.getViewport().transformScreenToView(touch.clientX, touch.clientY);
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
      this._element.focus();

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
      this._element.focus();

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

      if (this.doInputDown(touch.clientX, touch.clientY, 0))
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

    this._controller.getViewport().setScale(this.pinchDist * PINCH_SENSITIVITY);

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
    const pointer = this._controller._pointer;
    const picker = this._controller._picker;

    const mouse = this._controller.getViewport().transformScreenToView(e.clientX, e.clientY);
    pointer.setPosition(mouse.x, mouse.y);
  }

  onMouseDown(e)
  {
    e.stopPropagation();
    e.preventDefault();

    document.activeElement.blur();
    this._element.focus();

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

    //HACK: To allow Mac's to use ctrl+click as right clicks
    const button = e.ctrlKey ? 2 : e.button;
    if (this.doInputDown(e.clientX, e.clientY, button))
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

  doInputDown(x, y, button)
  {
    const pointer = this._controller._pointer;
    const picker = this._controller._picker;

    const mouse = this._controller.getViewport().transformScreenToView(x, y);
    pointer.setPosition(mouse.x, mouse.y);

    this._dragging = false;
    this._altaction = button == 2;

    this._controller.emit("preinputdown");

    pointer.beginAction();

    //Check whether to accept the start of input...
    const event = {result: true};
    this._controller.emit("inputdown");

    this._cursor._timer = setTimeout(() => {
      if (!this._dragging)
      {
        this._altaction = true;
      }
    }, Config.LONG_TAP_TICKS);

    return event.result;
  }

  doInputDownAndMove(x, y)
  {
    const pointer = this._controller._pointer;
    const picker = this._controller._picker;

    const mouse = this._controller.getViewport().transformScreenToView(x, y);
    pointer.setPosition(mouse.x, mouse.y);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (!this._dragging)
    {
      if (pointer.getDistanceSquToInitial() > this.getDraggingRadiusSqu())
      {
        //Start drag!
        this._dragging = true;
        this._controller.emit("dragstart");
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
      this._controller.emit("dragmove");
    }

    this._controller.emit("inputmove");
  }

  doInputDownAndUp(x, y)
  {
    if (this._cursor._timer)
    {
      clearTimeout(this._cursor._timer);
      this._cursor._timer = null;
    }

    const picker = this._controller._picker;
    const pointer = this._controller._pointer;
    picker.updateTarget(pointer.x, pointer.y);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (this._dragging)
    {
      //Stop drag!
      this._controller.emit("dragstop");
    }
    else
    {
      //Tap!
      this._controller.emit("inputaction");
    }

    this._controller.emit("inputup");

    //Set target as nothing since no longer interacting
    picker.clearTarget();

    pointer.endAction();
  }
}

export default InputAdapter;
