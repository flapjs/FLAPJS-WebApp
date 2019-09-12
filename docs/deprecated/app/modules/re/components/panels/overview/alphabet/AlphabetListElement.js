import React from 'react';
import Style from './AlphabetListElement.css';

const SUBMIT_KEY_CODE = 'Enter';
const CANCEL_KEY_CODE = 'Escape';

class AlphabetListElement extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputElement = null;

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
        const symbol = this.props.symbol;

        this.setState({
            value: symbol,
            error: false
        }, () => target.select());

        //Call any listening focus
        if (this.props.onFocus) this.props.onFocus(e, this);
    }

    onBlur(e)
    {
        const nextSymbol = this.state.value;

        //Call any listening blurs
        if (this.props.onBlur) this.props.onBlur(e, this, nextSymbol);

        //Reset to nothing (will use props.symbol instead)
        this.setState({ value: null, error: false });
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
            catch(e)
            {
                error = true;
            }
        }

        this.setState({
            value: value,
            error: error
        });
    }

    focus()
    {
        this._inputElement.focus();
    }

    /** @override */
    render()
    {
        const inputSymbol = this.state.value;
        const displaySymbol = inputSymbol === null ? this.props.symbol : inputSymbol;

        const symbolUsed = this.props.used || false;

        return (
            <div id={this.props.id}
                className={Style.element_container +
          (displaySymbol !== null && displaySymbol.length <= 0 ? ' empty ' : '') +
          (inputSymbol !== null && this.state.error ? ' error ' : '') +
          (symbolUsed ? ' used ' : '') +
          ' ' + this.props.className}
                style={this.props.style}>
                <input ref={ref=>this._inputElement=ref}
                    spellCheck={false}
                    maxLength={1}
                    style={{width: '1ch'}}
                    value={displaySymbol}
                    onChange={this.onValueChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}/>
            </div>
        );
    }
}

export default AlphabetListElement;
