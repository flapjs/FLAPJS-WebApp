import InputContext from './InputContext.js';
import InputPointer from './InputPointer.js';

const LONG_TAP_TICKS = 600;
const DOUBLE_TAP_TICKS = 600;
const SCROLL_SENSITIVITY = 1.0 / 300.0;
const CURSOR_RADIUS = 4;
const CURSOR_RADIUS_SQU = CURSOR_RADIUS * CURSOR_RADIUS;
const DRAGGING_BUFFER = 18;
const DRAGGING_BUFFER_SQU = DRAGGING_BUFFER * DRAGGING_BUFFER;

/**
 * Provides an interface for input handlers to interact with a HTMLElement.
 * Each listenable element should correspond to only a single InputAdapter.
 */
class InputAdapter extends InputContext
{
    constructor(viewportAdapter)
    {
        super();

        this._viewportAdapter = viewportAdapter;

        this._contexts = [];
        this._activeDragHandler = null;

        this._element = null;
        this._cursor = {
            _mousemove: null,
            _mouseup: null,
            _touchmove: null,
            _touchend: null,
            _timer: null
        };
        this._pointer = null;

        //Although dragging could be in pointer, it should be here to allow
        //the adapter to be independent of pointer.
        this._dragging = false;
        this._altinput = false;

        this._holdInputDelay = LONG_TAP_TICKS;
        this._dblInputDelay = DOUBLE_TAP_TICKS;
        this._scrollSensitivity = SCROLL_SENSITIVITY;
        this._minTapRadius = CURSOR_RADIUS_SQU * 16;
        this._draggingRadiusSqu = CURSOR_RADIUS_SQU + DRAGGING_BUFFER_SQU;

        this._prevEmptyInput = false;
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

    bindContext(context)
    {
        if (!(context instanceof InputContext))
            throw new Error('Cannot bind invalid context - must be an instance of InputContext');

        this._contexts.unshift(context);
        return this;
    }

    bindContextAsLast(context)
    {
        if (!(context instanceof InputContext))
            throw new Error('Cannot bind invalid context - must be an instance of InputContext');

        this._contexts.push(context);
        return this;
    }

    unbindContext(context = null)
    {
        if (context)
        {
            const index = this._contexts.indexOf(context);
            if (index >= 0)
            {
                this._contexts.splice(index, 1);
                return context;
            }
            else
            {
                return null;
            }
        }
        else
        {
            return this._contexts.shift();
        }
    }

    clearContexts()
    {
        this._contexts.length = 0;
    }

    hasContexts()
    {
        return this._contexts.length > 0;
    }

    getCurrentContext()
    {
        if (this._contexts.length > 0)
        {
            return this._contexts[this._contexts.length - 1];
        }
        else
        {
            return this;
        }
    }

    initialize(element)
    {
        if (!(element instanceof SVGElement)) throw new Error('Missing SVG element for input adapter\'s viewport');
        if (this._element) throw new Error('Trying to initialize an InputAdapter already initialized');

        this._viewportAdapter.setElement(this._element = element);
        this._pointer = new InputPointer(this, this._viewportAdapter, this._element);

        this._element.addEventListener('mousedown', this.onMouseDown);
        this._element.addEventListener('mousemove', this.onMouseMove);
        this._element.addEventListener('touchstart', this.onTouchStart);
        this._element.addEventListener('touchmove', this.onTouchMove);
        this._element.addEventListener('contextmenu', this.onContextMenu);
        this._element.addEventListener('wheel', this.onWheel);
    }

    destroy()
    {
        if (!this._element) throw new Error('Trying to destroy an InputAdapter that is not yet initialized');

        this._element.removeEventListener('mousedown', this.onMouseDown);
        this._element.removeEventListener('mousemove', this.onMouseMove);
        this._element.removeEventListener('touchstart', this.onTouchStart);
        this._element.removeEventListener('contextmenu', this.onContextMenu);
        this._element.removeEventListener('wheel', this.onWheel);

        this._element = null;
    }

    update()
    {
        if (this._element)
        {
            //Smooth transition offset
            this._viewportAdapter.update();
        }
    }

    /** @override */
    handleEvent(eventName, ...eventArgs)
    {
        for (const context of this._contexts)
        {
            const result = context.handleEvent(eventName, ...eventArgs);
            if (result)
            {
                return result;
            }
        }

        return super.handleEvent(eventName, ...eventArgs);
    }

    onMouseDown(e)
    {
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
        const mouse = this._viewportAdapter.transformScreenToView(e.clientX, e.clientY);
        const pointer = this._pointer;
        pointer.setPosition(mouse.x, mouse.y);

        if (this.handleEvent('onMoveInputEvent', pointer))
        {
            e.stopPropagation();
            e.preventDefault();

            this.cancelInputEvent();
        }
    }

    onMouseDownThenMove(e)
    {
        e.stopPropagation();
        e.preventDefault();

        this.onInputMove(e.clientX, e.clientY);

        return false;
    }

    onMouseDownThenUp(e)
    {
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
        e.stopPropagation();
        e.preventDefault();

        const touch = e.changedTouches[0];
        this.onInputMove(touch.clientX, touch.clientY);

        return false;
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

        const pointer = this._pointer;
        const dy = e.deltaY * this._scrollSensitivity;
        const prev = this._viewportAdapter.getScale();
        const next = prev + dy;

        //Let others handle this event...
        if (!this.handleEvent('onZoomChange', pointer, next, prev))
        {
            this._viewportAdapter.setScale(next);
        }

        return false;
    }

    onInputDown(x, y, button)
    {
        //Setup for hold timer...
        const cursor = this._cursor;
        const pointer = this._pointer;
        const mouse = this._viewportAdapter.transformScreenToView(x, y);
        pointer.setPosition(mouse.x, mouse.y);

        this._dragging = false;
        this._altinput = button == 2;

        //Let others handle this event...
        if (!this.handleEvent('onPreInputEvent', pointer))
        {
            pointer.beginInput();
            cursor._timer = setTimeout(this.onDelayedInputDown, this._holdInputDelay);
            return true;
        }

        return false;
    }

    onDelayedInputDown()
    {
        //That means the input is remaining still (like a hold)...
        if (!this._dragging)
        {
            this._altinput = true;
        }
    }

    onInputMove(x, y)
    {
        const pointer = this._pointer;
        const mouse = this._viewportAdapter.transformScreenToView(x, y);
        pointer.setPosition(mouse.x, mouse.y);

        if (!this._dragging)
        {
            if (pointer.getDistanceSquToInitial() > this._draggingRadiusSqu)
            {
                this._dragging = true;

                //Let others handle this event...
                const inputEventPosition = pointer.getInputEventPosition();
                const result = this.handleEvent('onDragStart', pointer, inputEventPosition.x, inputEventPosition.y);
                if (!result)
                {
                    this._dragging = false;

                    //TODO: you could NOT cancel the event and just update the target?
                    //If so, who is the initial target then?

                    //Stop the input event early...
                    this.cancelInputEvent();
                }
                else
                {
                    this._activeDragHandler = result;
                }
            }
            else
            {
                //Still a click or hold...
            }
        }
        else
        {
            //Continue to drag...
            if (this._activeDragHandler)
            {
                this._activeDragHandler.onDragMove(pointer);
            }
        }
    }

    onInputUp(x, y)
    {
        const cursor = this._cursor;
        const timer = cursor._timer;
        if (timer)
        {
            clearTimeout(timer);
            cursor._timer = null;
        }

        //Update pointer target to final position
        const pointer = this._pointer;
        const mouse = this._viewportAdapter.transformScreenToView(x, y);
        pointer.setPosition(mouse.x, mouse.y);

        if (this._dragging)
        {
            //Stop dragging!
            if (this._activeDragHandler)
            {
                this._activeDragHandler.onDragStop(pointer);
                this._activeDragHandler = null;
            }
        }
        else
        {
            if (this._altinput)
            {
                //Alt Tap!
                this.handleEvent('onAltInputEvent', pointer);
            }
            else
            {
                //If the input was not consumed...
                if (!this.handleEvent('onInputEvent', pointer))
                {
                    //Try for double tap...
                    const dx = x - this._prevEmptyX;
                    const dy = y - this._prevEmptyY;
                    const dist = dx * dx + dy * dy;
                    const dt = Date.now() - this._prevEmptyTime;
                    if (this._prevEmptyInput &&
                        dist < this._minTapRadius &&
                        dt < this._dblInputDelay)
                    {
                        //Double tap!
                        this.handleEvent('onDblInputEvent', pointer);

                        this._prevEmptyInput = false;
                    }
                    else
                    {
                        this._prevEmptyInput = true;
                        this._prevEmptyTime = Date.now();
                        this._prevEmptyX = x;
                        this._prevEmptyY = y;
                    }
                }
            }
        }

        pointer.endInput();
        this.handleEvent('onPostInputEvent', pointer);
    }

    cancelInputEvent()
    {
        const pointer = this._pointer;
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

        const timer = cursor._timer;
        if (timer)
        {
            clearTimeout(timer);
            cursor._timer = null;
        }

        pointer.endInput();
        this.handleEvent('onPostInputEvent', pointer);
    }

    getContexts() { return this._contexts; }
    getActiveElement() { return this._element; }
    getViewportAdapter() { return this._viewportAdapter; }
    getPointerX() { return this._pointer ? this._pointer.x : 0; }
    getPointerY() { return this._pointer ? this._pointer.y : 0; }
    isPointerActive() { return this._pointer ? this._pointer.isActive() : false; }
    isUsingTouch() { return this._cursor._touchmove || this._cursor._touchend; }
    isAltInput() { return this._altinput; }
    isDragging() { return this._dragging; }
}

export default InputAdapter;
