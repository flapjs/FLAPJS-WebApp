import React from 'react';
import PropTypes from 'prop-types';

const DEBOUNCE_DELAY = 50;

class DebounceButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this._timeout = null;
        this._active = true;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onAnyMouseUp = this.onAnyMouseUp.bind(this);
    }

    onMouseDown(e)
    {
        const parent = this.props.parent;
        if (parent)
        {
            if (parent.getIgnoreNextBlurEvent())
            {
                // The debounce event is already by handled by another element...
                this._active = false;
            }
            else if (!parent.hasFocus())
            {
                // This is not a re-focus evnet, just focus normally.
                this._active = true;
            }
            else
            {
                // We need to return focus to the parent later...
                parent.ignoreNextBlurEvent();
                this._active = true;
            }

            document.addEventListener('mouseup', this.onAnyMouseUp);
        }

        // Since we overriden the default onMouseDown, this is to make-up for that call.
        if (this.props.onMouseDown) this.props.onMouseDown(e);
    }

    onAnyMouseUp(e)
    {
        document.removeEventListener('mouseup', this.onAnyMouseUp);

        if (this._active)
        {
            this._active = false;
            if (this._timeout) clearTimeout(this._timeout);
            this._timeout = setTimeout(() => 
            {
                this._timeout = null;
                const parent = this.props.parent;
                if (parent) parent.focus();
            }, DEBOUNCE_DELAY);
        }
    }

    /** @override */
    render()
    {
        return (
            <button {...this.props}
                onMouseDown={this.onMouseDown}>
                {this.props.children}
            </button>
        );
    }
}
DebounceButton.propTypes = {
    // TODO: Fix type.
    parent: PropTypes.any,
    children: PropTypes.node,
    onMouseDown: PropTypes.func,
};

export default DebounceButton;
