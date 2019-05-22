import React from 'react';
import Style from './StateListElement.css';

const SUBMIT_KEY_CODE = 'Enter';
const CANCEL_KEY_CODE = 'Escape';

class StateListElement extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: null,
            error: false
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onFocus(e)
    {
        const target = e.target;
        const node = this.props.node;

        const nodeLabel = node ? node.getNodeLabel() : null;
        this.setState({
            value: nodeLabel,
            error: false
        }, () => target.select());

        // Call any listening focus
        if (this.props.onFocus) this.props.onFocus(e, this);
    }

    onBlur(e)
    {
        const nextLabel = this.state.value;

        // Reset to nothing (will use node.getNodeLabel() instead)
        this.setState({ value: null, error: false });

        // Call any listening blurs
        if (this.props.onBlur) this.props.onBlur(e, this, nextLabel);
    }

    onKeyDown(e)
    {
        const keyCode = e.key;
        if (keyCode === SUBMIT_KEY_CODE || keyCode === CANCEL_KEY_CODE)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onKeyUp(e)
    {
        const keyCode = e.key;
        const target = e.target;

        if (keyCode === SUBMIT_KEY_CODE)
        {
            target.blur();
        }
        else if (keyCode === CANCEL_KEY_CODE)
        {
            this.setState({
                value: null,
                error: false
            }, () => target.blur());
        }
    }

    onValueChange(e)
    {
        let value = e.target.value.trim();
        let error = false;

        if (this.props.onChange)
        {
            try
            {
                this.props.onChange(e, this, value);
            }
            catch (e)
            {
                error = true;
            }
        }

        this.setState({
            value: value,
            error: error
        });
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const inputValue = this.state.value;

        const nodeLabel = node ? node.getNodeLabel() : '';
        const nodeCustom = node ? (node.getNodeCustom() || inputValue !== null && inputValue !== nodeLabel) : false;
        const nodeAccept = node ? node.getNodeAccept() : false;
        // Must check for null, not ONLY truthy because value might be empty string.
        const displayValue = inputValue === null ? nodeLabel : inputValue;

        return (
            <div id={this.props.id}
                className={Style.element_container +
                    (nodeCustom ? ' custom ' : '') +
                    ((!node.getNodeCustom() && displayValue.length <= 0) ? ' empty ' : '') +
                    (inputValue !== null && this.state.error ? ' error ' : '') +
                    (nodeAccept ? ' accept ' : '') +
                    ' ' + this.props.className}
                style={this.props.style}>
                <input
                    spellCheck={false}
                    style={{ width: displayValue.length + 'ch' }}
                    value={displayValue}
                    onChange={this.onValueChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp} />
            </div>
        );
    }
}

export default StateListElement;
