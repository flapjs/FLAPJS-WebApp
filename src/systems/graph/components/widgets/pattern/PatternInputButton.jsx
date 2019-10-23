import React from 'react';
import PropTypes from 'prop-types';

const RETURN_FOCUS_DELAY = 50;

class PatternInputButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;

        this._timeout = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onAnyMouseUp = this.onAnyMouseUp.bind(this);
    }

    onMouseDown(e)
    {
        const parent = this.props.parent;
        if (parent.ignoreBlur(true))
        {
            document.addEventListener('mouseup', this.onAnyMouseUp);
        }

        if (this.props.onClick)
        {
            this.props.onClick(e, this);
        }
    }

    onAnyMouseUp()
    {
        document.removeEventListener('mouseup', this.onAnyMouseUp);

        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => 
        {
            this._timeout = null;

            const parent = this.props.parent;
            parent.ignoreBlur(false);

            if (document.activeElement === this.ref)
            {
                parent.focus(false);
            }
            else if (document.activeElement !== this.props.parent.inputElement)
            {
                parent.onBlur();
            }
        }, RETURN_FOCUS_DELAY);
    }

    /** @override */
    render()
    {
        return (
            <button ref={ref => this.ref = ref}
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={this.props.title}
                onMouseDown={this.onMouseDown}>
                {this.props.title}
            </button>
        );
    }
}
PatternInputButton.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    // TODO: Fix type.
    parent: PropTypes.any,
    onClick: PropTypes.func,
};

export default PatternInputButton;
