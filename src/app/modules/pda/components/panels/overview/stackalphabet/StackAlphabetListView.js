import React from 'react';
import Style from './StackAlphabetListView.css';

import IconButton from 'experimental/components/IconButton.js';
import BoxAddIcon from 'components/iconset/BoxAddIcon.js';

import StackAlphabetListElement from './StackAlphabetListElement.js';

class StackAlphabetListView extends React.Component
{
    constructor(props)
    {
        super(props);

        this.newSymbolComponent = null;

        this.state = {
            useNewSymbol: false
        };

        this.onElementAdd = this.onElementAdd.bind(this);
        this.onElementFocus = this.onElementFocus.bind(this);
        this.onElementBlur = this.onElementBlur.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
    }

    onElementAdd(e)
    {
    //Create a new alphabet element...
        this.setState({useNewSymbol: true}, () => 
        {
            this.newSymbolComponent.focus();
        });
    }

    onElementFocus(e, element)
    {
    //Do nothing...
    }

    onElementBlur(e, element, nextSymbol)
    {
        const symbol = element.props.symbol;
        const machineController = this.props.machineController;

        if (nextSymbol !== null)
        {
            const machine = machineController.getMachineBuilder().getMachine();
            if (nextSymbol.length > 0)
            {
                if (!machine.isStackSymbol(nextSymbol))
                {
                    if (symbol)
                    {
                        //None other have the same name. Rename it!
                        machineController.renameStackSymbol(symbol, nextSymbol);
                    }
                    else
                    {
                        //None other have the same name. Create it!
                        machineController.createStackSymbol(nextSymbol);
                    }
                }
                else
                {
                    //Found something already named that! Ignore!
                }
            }
            else if (symbol)
            {
                //Delete!
                machineController.deleteStackSymbol(symbol);
            }
        }

        //Regardless, just close the "new" alphabet element if open.
        if (this.state.useNewSymbol)
        {
            this.setState({ useNewSymbol: false });
        }
    }

    onElementChange(e, element, symbol)
    {
        const machineController = this.props.machineController;

        if (symbol.length > 0)
        {
            //If there are more than 1 symbols by the same name,
            //OR if the duplicate symbol found is NOT the same symbol
            const machine = machineController.getMachineBuilder().getMachine();
            if (machine.isStackSymbol(symbol) && symbol !== element.props.symbol)
            {
                throw new Error('Not a valid symbol');
            }
        }
    }

    renderStackAlphabetList(machine, alphabet)
    {
        const result = [];
        for(const symbol of alphabet)
        {
            if (!symbol) continue;

            result.push(<StackAlphabetListElement key={symbol}
                symbol={symbol}
                used={machine.isUsedStackSymbol(symbol)}
                onFocus={this.onElementFocus}
                onBlur={this.onElementBlur}
                onChange={this.onElementChange}/>);
        }
        return result;
    }

    /** @override */
    render()
    {
        const machineController = this.props.machineController;
        const machine = machineController.getMachineBuilder().getMachine();
        const alphabet = machine.getStackAlphabet();

        return (
            <div id={this.props.id}
                className={Style.list_container}
                style={this.props.style}>
                <div className={Style.element_list}>
                    {this.renderStackAlphabetList(machine, alphabet)}
                    <StackAlphabetListElement
                        ref={ref=>this.newSymbolComponent=ref}
                        style={{display: this.state.useNewSymbol ? 'block' : 'none'}}
                        symbol={''}
                        onFocus={this.onElementFocus}
                        onBlur={this.onElementBlur}
                        onChange={this.onElementChange}/>
                </div>
                <IconButton className={Style.add_button}
                    title="Add Stack"
                    onClick={this.onElementAdd}>
                    <BoxAddIcon/>
                </IconButton>
            </div>
        );
    }
}

export default StackAlphabetListView;
