import React from 'react';
import PropTypes from 'prop-types';

const DEBOUNCE_DELAY = 30;

// TODO: we need to somehow maintain caret position between focus.
class DebounceInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputElement = React.createRef();

        this._debounceTimeout = null;
        this._ignoreNextBlurEvent = false;

        this._prevCaretPosition = { start: -1, end: -1 };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    focus() { this._inputElement.current.focus(); }
    blur() { this._inputElement.current.blur(); }

    ignoreNextBlurEvent()
    {
        this._ignoreNextBlurEvent = true;
        return this;
    }

    onFocus(e)
    {
        if (this._ignoreNextBlurEvent)
        {
            this._ignoreNextBlurEvent = false;

            e.target.setSelectionRange(this._prevCaretPosition.start, this._prevCaretPosition.end);
            return;
        }

        if (this.props.onFocus) this.props.onFocus(e);

        // Update caret position for current computation...
        this.updateCaretPosition();
    }

    onBlur(e)
    {
        // Save current caret position for later...
        this.updateCaretPosition();

        if (!this._debounceTimeout)
        {
            this._debounceTimeout = setTimeout(() => 
            {
                this._debounceTimeout = null;
                if (this._ignoreNextBlurEvent)
                {
                    // If ignored, we are promised to return focus...
                    return;
                }

                // Reset! We lost focus.
                this.resetCaretPosition();

                // NOTE: You cannot pass the event here due to how React handles events.
                // ... so we made our own :D
                if (this.props.onBlur) this.props.onBlur({ target: null });
            }, DEBOUNCE_DELAY);
        }
    }

    hasFocus() { return document.activeElement === this._inputElement.current; }
    getIgnoreNextBlurEvent() { return this._ignoreNextBlurEvent; }

    hasCaretSelection() { return this._prevCaretPosition.start !== this._prevCaretPosition.end; }
    hasCaretPosition() { return this._prevCaretPosition.start >= 0; }
    getCaretPosition() { return this._prevCaretPosition; }
    setCaretPosition(start, end = start, forceUpdate = false)
    {
        this._prevCaretPosition.start = start;
        this._prevCaretPosition.end = end;

        if (forceUpdate)
        {
            this._inputElement.current.setSelectionRange(start, end);
        }
        return this;
    }

    resetCaretPosition() { this.setCaretPosition(-1, -1); }
    updateCaretPosition()
    {
        const element = this._inputElement.current;
        this.setCaretPosition(element.selectionStart, element.selectionEnd);
    }

    getInputElement() { return this._inputElement.current; }

    /** @override */
    render()
    {
        return (
            this.props.multiline ?
                <textarea
                    {...this.props}
                    ref={this._inputElement}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}>
                </textarea> :
                <input
                    {...this.props}
                    type='text'
                    ref={this._inputElement}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}>
                </input>
        );
    }
}
DebounceInput.propTypes = {
    multiline: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};

export default DebounceInput;
