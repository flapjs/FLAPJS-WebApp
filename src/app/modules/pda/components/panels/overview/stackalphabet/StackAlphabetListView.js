import React from 'react';
import Style from './StackAlphabetListView.css';

import IconButton from 'experimental/components/IconButton.js';
import BoxAddIcon from 'experimental/iconset/BoxAddIcon.js';

import AlphabetListElement from './AlphabetListElement.js';

class StackAlphabetListView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.stackAlphabet = [];

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
    this.setState({useNewSymbol: true}, () => {
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
        if (this.stackAlphabet.includes(nextSymbol))
        {
          if (symbol)
          {
            //Rename
            const i = this.stackAlphabet.indexOf(symbol);
            this.stackAlphabet[i] = nextSymbol;
          }
          else
          {
            //Create
            this.stackAlphabet.push(nextSymbol);
          }
        }
        else
        {
          //Already there, do nothing.
        }
      }
      else if (symbol)
      {
        //Delete!
        const i = this.stackAlphabet.indexOf(symbol);
        this.stackAlphabet.splice(i, 1);
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
      if (this.stackAlphabet.includes(symbol) && symbol !== element.props.symbol)
      {
        throw new Error("Not a valid symbol");
      }
    }
  }

  renderAlphabetList(machine, alphabet)
  {
    const result = [];
    for(const symbol of alphabet)
    {
      if (!symbol) continue;

      result.push(<AlphabetListElement key={symbol}
        symbol={symbol}
        used={machine.isUsedSymbol(symbol)}
        onFocus={this.onElementFocus}
        onBlur={this.onElementBlur}
        onChange={this.onElementChange}/>);
    }
    return result;
  }

  //Override
  render()
  {
    const machineController = this.props.machineController;
    const machine = machineController.getMachineBuilder().getMachine();
    const alphabet = this.stackAlphabet;

    return (
      <div id={this.props.id}
        className={Style.list_container}
        style={this.props.style}>
        <div className={Style.element_list}>
          {this.renderAlphabetList(machine, alphabet)}
          <AlphabetListElement
            ref={ref=>this.newSymbolComponent=ref}
            style={{display: this.state.useNewSymbol ? "block" : "none"}}
            symbol={""}
            onFocus={this.onElementFocus}
            onBlur={this.onElementBlur}
            onChange={this.onElementChange}/>
        </div>
        <IconButton className={Style.add_button}
          title="Add Stack Symbol"
          onClick={this.onElementAdd}>
          <BoxAddIcon/>
        </IconButton>
      </div>
    );
  }
}

export default StackAlphabetListView;
