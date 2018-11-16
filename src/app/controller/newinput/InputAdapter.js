import Config from 'config.js';
import InputPointer from './InputPointer.js';

/**
 * Provides an interface for InputController to interact with a HTMLElement.
 * Each listenable element should correspond to only a single InputAdapter.
 */
class InputAdapter
{
  constructor()
  {
    this._controller = null;
    this._element = null;
    this._viewport = null;
    this._cursor = {
      _mousemove: null,
      _mouseup: null,
      _touchmove: null,
      _touchend: null,
      _timer: null
    };

    this._pointer = new InputPointer();

    //Although dragging could be in pointer, it should be here to allow
    //the adapter to be independent of pointer.
    this._dragging = false;
    this._altaction = false;

    this._holdInputDelay = Config.LONG_TAP_TICKS;
    this._dblActionDelay = Config.DOUBLE_TAP_TICKS;
    this._scrollSensitivity = Config.SCROLL_SENSITIVITY;
    this._minTapRadius = Config.CURSOR_RADIUS_SQU * 16;
    this._draggingRadiusSqu = Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;

    this._prevEmptyAction = false;
    this._prevEmptyTime = 0;
    this._prevEmptyX = 0;
    this._prevEmptyY = 0;

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.onMouseDownThenMove = this.onMouseDownThenMove.bind(this);
    this.onMouseDownThenUp = this.onMouseDownThenUp.bind(this);
    this.onTouchStartThenMove = this.onTouchStartThenMove.bind(this);
    this.onTouchStartThenEnd = this.onTouchStartThenEnd.bind(this);

    this.onDelayedInputDown = this.onDelayedInputDown.bind(this);
  }

  setController(controller)
  {
    this._controller = controller;
    return this;
  }

  initialize(element, viewport)
  {
    if (!(element instanceof SVGElement)) throw new Error("Invalid SVG element for InputAdapter");
    if (!viewport) throw new Error("Missing viewport for InputAdapter");
    if (viewport.getElement() != element) throw new Error("Mismatched viewport for passed-in element");
    if (this._element) throw new Error("Trying to initialize an InputAdapter already initialized");

    this._element = element;
    this._viewport = viewport;

    this._element.addEventListener('mousedown', this.onMouseDown);
    this._element.addEventListener('mousemove', this.onMouseMove);
    this._element.addEventListener('touchstart', this.onTouchStart);
    this._element.addEventListener('touchmove', this.onTouchMove);
    this._element.addEventListener('contextmenu', this.onContextMenu);
    this._element.addEventListener('wheel', this.onWheel);
  }

  destroy()
  {
    if (!this._element) throw new Error("Trying to destroy an InputAdapter that is not yet initialized");

    this._element.removeEventListener('mousedown', this.onMouseDown);
    this._element.removeEventListener('mousemove', this.onMouseMove);
    this._element.removeEventListener('touchstart', this.onTouchStart);
    this._element.removeEventListener('contextmenu', this.onContextMenu);
    this._element.removeEventListener('wheel', this.onWheel);

    this._element = null;
  }

  onMouseDown(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    const cursor = this._cursor;

    //Blur any element in focus
    document.activeElement.blur();
    this._element.focus();

    //Make sure mouse move is deleted, just in case
    if (cursor._mousemove)
    {
      document.removeEventListener('mousemove', cursor._mousemove);
      cursor._mousemove = null;
    }
    //Make sure mouse up is deleted, just in case
    if (cursor._mouseup)
    {
      document.removeEventListener('mouseup', cursor._mouseup);
      cursor._mouseup = null;
    }

    //HACK: To allow Mac's to use ctrl+click as right clicks
    const button = e.ctrlKey ? 2 : e.button;

    //Is this a valid mouse down?
    if (this.onInputDown(e.clientX, e.clientY, button))
    {
      //Start mouse down logic...
      cursor._mousemove = this.onMouseDownThenMove;
      cursor._mouseup = this.onMouseDownThenUp;

      document.addEventListener('mousemove', cursor._mousemove);
      document.addEventListener('mouseup', cursor._mouseup);
    }

    return false;
  }

  onMouseMove(e)
  {
    if (!this._controller) return false;

    const mouse = this._viewport.transformScreenToView(e.clientX, e.clientY);
    this._pointer.setPosition(mouse.x, mouse.y);

    //Can update target here for hover effects...
  }

  onMouseDownThenMove(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    this.onInputMove(e.clientX, e.clientY);

    return false;
  }

  onMouseDownThenUp(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    const cursor = this._cursor;

    //Make sure mouse move is deleted, just in case
    if (cursor._mousemove)
    {
      document.removeEventListener('mousemove', cursor._mousemove);
      cursor._mousemove = null;
    }
    //Make sure mouse up is deleted, just in case
    if (cursor._mouseup)
    {
      document.removeEventListener('mouseup', cursor._mouseup);
      cursor._mouseup = null;
    }

    this.onInputUp(e.clientX, e.clientY);

    return false;
  }

  onTouchStart(e)
  {
    if (!this._controller) return false;

    if (e.changedTouches.length == 1)
    {
      e.stopPropagation();
      e.preventDefault();

      const cursor = this._cursor;

      //Blur any element in focus
      document.activeElement.blur();
      this._element.focus();

      //Make sure touch move is deleted, just in case
      if (cursor._touchmove)
      {
        document.removeEventListener('touchmove', cursor._touchmove);
        cursor._touchmove = null;
      }
      //Make sure touch end is deleted, just in case
      if (cursor._touchend)
      {
        document.removeEventListener('touchend', cursor._touchend);
        cursor._touchend = null;
      }

      const touch = e.changedTouches[0];
      //Is this a valid touch start?
      if (this.onInputDown(touch.clientX, touch.clientY, 0))
      {
        //Start touch start logic...
        cursor._touchmove = this.onTouchStartThenMove;
        cursor._touchend = this.onTouchStartThenEnd;

        document.addEventListener('touchmove', cursor._touchmove);
        document.addEventListener('touchend', cursor._touchend);
      }

      return false;
    }
  }

  onTouchStartThenEnd(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    const cursor = this._cursor;

    //Make sure mouse move is deleted, just in case
    if (cursor._touchmove)
    {
      document.removeEventListener('touchmove', cursor._touchmove);
      cursor._touchmove = null;
    }
    //Make sure mouse up is deleted, just in case
    if (cursor._touchend)
    {
      document.removeEventListener('touchend', cursor._touchend);
      cursor._touchend = null;
    }

    const touch = e.changedTouches[0];
    this.onInputUp(touch.clientX, touch.clientY);

    return false;
  }

  onTouchStartThenMove(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    const touch = e.changedTouches[0];
    this.onInputMove(touch.clientX, touch.clientY);

    return false;
  }

  onContextMenu(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    return false;
  }

  onWheel(e)
  {
    if (!this._controller) return false;

    e.stopPropagation();
    e.preventDefault();

    const controller = this._controller;
    const dy = e.deltaY * this._scrollSensitivity;
    const prev = this._viewport.getScale();
    const next = prev + dy;

    if (controller.onZoomChange(this._pointer, next, prev))
    {
      this._viewport.setScale(next);
    }

    return false;
  }

  onInputDown(x, y, button)
  {
    if (!this._controller) throw new Error("Missing controller for input adapter");

    //Setup for hold timer...
    const cursor = this._cursor;
    const controller = this._controller;
    const mouse = this._viewport.transformScreenToView(x, y);
    this._pointer.setPosition(mouse.x, mouse.y);

    this._dragging = false;
    this._altaction = button == 2;

    if (!controller.onPreActionEvent(this._pointer))
    {
      this._pointer.beginAction();
      cursor._timer = setTimeout(this.onDelayedInputDown, this._holdInputDelay);
      return true;
    }

    return false;
  }

  onDelayedInputDown()
  {
    if (!this._controller) throw new Error("Missing controller for input adapter");

    //That means the input is remaining still (like a hold)...
    if (!this._dragging)
    {
      this._altaction = true;
    }
  }

  onInputMove(x, y)
  {
    if (!this._controller) throw new Error("Missing controller for input adapter");

    const controller = this._controller;
    const mouse = this._viewport.transformScreenToView(x, y);
    this._pointer.setPosition(mouse.x, mouse.y);

    if (!this._dragging)
    {
      if (this._pointer.getDistanceSquToInitial() > this._draggingRadiusSqu)
      {
        this._dragging = true;
        controller.onDragStart(this._pointer);
      }
      else
      {
        //Still a click or hold...
      }
    }
    else
    {
      //Continue to drag...
      controller.onDragMove(this._pointer);
    }
  }

  onInputUp(x, y)
  {
    if (!this._controller) throw new Error("Missing controller for input adapter");

    const cursor = this._cursor;
    const timer = cursor._timer;
    if (timer)
    {
      clearTimeout(timer);
      cursor._timer = null;
    }

    //Update pointer target to final position
    const controller = this._controller;
    const mouse = this._viewport.transformScreenToView(x, y);
    this._pointer.setPosition(mouse.x, mouse.y);

    if (this._dragging)
    {
      //Stop dragging!
      controller.onDragStop(this._pointer);
    }
    else
    {
      if (this._altaction)
      {
        //Alt Tap!
        controller.onAltActionEvent(this._pointer);
      }
      else
      {
        //Tap!
        const result = controller.onActionEvent(this._pointer);

        //If the action was not consumed...
        if (!result)
        {
          //Try for double tap...
          const dx = x - this._prevEmptyX;
          const dy = y - this._prevEmptyY;
          const dist = dx * dx + dy * dy;
          const dt = Date.now() - this._prevEmptyTime;
          if (this._prevEmptyAction &&
            dist < this._minTapRadius &&
            dt < this._dblActionDelay)
          {
            //Double tap!
            controller.onDblActionEvent(this._pointer);

            this._prevEmptyAction = false;
          }
          else
          {
            this._prevEmptyAction = true;
            this._prevEmptyTime = Date.now();
            this._prevEmptyX = x;
            this._prevEmptyY = y;
          }
        }
      }
    }

    this._pointer.endAction();

    controller.onPostActionEvent(this._pointer);
  }

  getActiveElement()
  {
    return this._element;
  }

  getActiveViewport()
  {
    return this._viewport;
  }

  getPointer()
  {
    return this._pointer;
  }

  isUsingTouch()
  {
    return this._cursor._touchmove || this._cursor._touchend;
  }

  isAltAction()
  {
    return this._altaction;
  }

  isDragging()
  {
    return this._dragging;
  }
}

export default InputAdapter;
