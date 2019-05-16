import React from 'react';

import './AlphabetTag.css';
import Config from 'deprecated/config.js';

class AlphabetTag extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;

        this.state = {
            symbol: null,
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
        this.setState({
            symbol: this.props.src,
            error: false
        }, () => target.select());

        //Call any listening focus
        if (this.props.onFocus) this.props.onFocus(e);
    }

    onBlur(e)
    {
        const machineController = this.props.machineController;
        const newSymbol = this.state.symbol;

        if (newSymbol != null)
        {
            const oldSymbol = this.props.src;
            if (newSymbol.length > 0)
            {
                const alphabet = machineController.getAlphabet();
                if (!alphabet.includes(newSymbol))
                {
                    if (oldSymbol)
                    {
                        //Valid! Rename it!
                        machineController.renameSymbol(oldSymbol, newSymbol);
                    }
                    else
                    {
                        //Valid! Add it to the list!
                        machineController.createSymbol(newSymbol);
                    }
                }
                else
                {
                    //Found something already named that! Ignore!
                }
            }
            else if (oldSymbol)
            {
                //Delete!
                machineController.deleteSymbol(oldSymbol);
            }
        }

        this.setState({symbol: null, error: false});

        //Call any listening blurs
        if (this.props.onBlur) this.props.onBlur(e);
    }

    onKeyDown(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
        {
            e.preventDefault();
        }
    }

    onKeyUp(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY)
        {
            e.target.blur();
        }
        else if (e.keyCode === Config.CLEAR_KEY)
        {
            const target = e.target;
            this.setState({ symbol: null, error: false}, () => 
            {
                target.blur();
            });
        }
    }

    onValueChange(e)
    {
        const machineController = this.props.machineController;
        const symbol = e.target.value.trim();
        let error = false;
        if (symbol.length > 0)
        {
            const alphabet = machineController.getAlphabet();
            if (alphabet.includes(symbol) && symbol != this.props.src)
            {
                error = true;
            }
        }

        this.setState({
            symbol: symbol,
            error: error
        });
    }

    render()
    {
        const symbol = this.state.symbol != null ? this.state.symbol : this.props.src;
        const isUsed = false;
        //TODO: const isUsed = this.props.src && this.props.machineController.isUsedSymbol(symbol);
        return <div className={'alphatag-container' +
      (isUsed ? ' usedtag' : '') +
      (this.props.src && (!symbol || symbol.length == 0) ? ' emptytag' : '') +
      (this.state.symbol && this.state.error ? ' errortag' : '')}>
            <input type="text" ref={ref=>this.ref=ref} className="alphatag-input"
                spellCheck="false"
                maxLength="1"
                value={symbol}
                onChange={this.onValueChange}
                onFocus = {this.onFocus}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}/>
        </div>;
    }
}

export default AlphabetTag;
