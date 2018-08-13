import React from 'react';

import './AlphabetTag.css';
import Config from 'config.js';

class AlphabetTag extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();

    this.state = {
      symbol: null,
      error: false
    };

    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onFocus(e) {
    this.setState({
      symbol: this.props.src,
      error: false
    });
  }

  onBlur(e) {
    const oldSymbol = this.props.src;
    const newSymbol = this.state.symbol;
    const graph = this.props.machine.graph;
    const edges = graph.edges;

    if(newSymbol == null) return;

    if(newSymbol.length > 0) {
      if(oldSymbol == newSymbol) return;

      if(!this.props.alphabet.includes(newSymbol)) {
        this.props.machine.addSymbol(newSymbol);
        let edge = null;
        for(let i = edges.length -1; i >= 0; i--) {
          edge = edges[i];
          if(edge.label == oldSymbol) {
            edge.setLabel(newSymbol);
          }
        }
        if(this.props.machine.includes(oldSymbol)) {
          this.props.machine.removeSymbol(oldSymbol);
          this.props.machine.addSymbol(newSymbol);
        }
      }
    } else if(this.props.alphabet.includes(oldSymbol)) {
      let edge = null;
      for(let i = edges.length -1; i >= 0; i--) {
        edge = edges[i];
        if(edge.label == oldSymbol) {
          graph.deleteEdge(edge);
        }
      }
      if(this.props.machine.includes(oldSymbol)) {
        this.props.machine.removeSymbol(oldSymbol);
      }
    }
    this.setState({
      symbol: null,
      error: false
    });
    this.props.list.disableEdit();
  }

  onKeyUp(e) {
    if(e.keyCode === Config.SUBMIT_KEY) {
      e.target.blur();
    } else if(e.keyCode === Config.CLEAR_KEY) {
      const target = e.target;
      this.setState({symbol: null}, () => {
        target.blur();
      });
    }
  }

  onKeyDown(e) {
    if(e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY) {
      e.preventDefault();
    }
  }

  onValueChange(e) {
    const symbol = e.target.value;
    let error = false;
    if(symbol.length > 0) {
      if(this.props.alphabet.includes(symbol) && symbol != this.props.src) {
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
    return <div className="alphatag-container" style={this.props.style}>
      <input type="text" ref={ref=>this.ref=ref} className="alphatag-input"
             spellCheck="false" maxLength="1" value={symbol}
      onChange={this.onValueChange}
      onFocus = {this.onFocus}
      onBlur={this.onBlur}
      onKeyUp={this.onKeyUp}
      onKeyDown={this.onKeyDown}/>
    </div>
  }
}

export default AlphabetTag;
