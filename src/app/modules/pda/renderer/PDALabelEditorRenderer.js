import React from 'react';
import Style from './PDALabelEditorRenderer.css';

import PatternInputButton from 'system/patterninput/PatternInputButton.js';
import { SYMBOL_SEPARATOR, EMPTY_CHAR } from 'modules/pda/graph/PDAEdge.js';

const RECOMMENDED_SYMBOLS = ["0", "1"];
const DEFAULT_SYMBOLS = [EMPTY_CHAR];

class PDALabelEditorRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  renderSymbol(symbol)
  {
    const labelEditor = this.props.parent;
    if (!labelEditor) return null;

    const inputComponent = labelEditor.inputComponent;
    return (
      <PatternInputButton key={symbol} parent={inputComponent} title={symbol}
        onClick={e=>inputComponent.appendValue(symbol, SYMBOL_SEPARATOR)}/>
    );
  }

  //Override
  render()
  {
    const labelEditor = this.props.parent;
    const currentModule = this.props.currentModule;
    const machineController = currentModule.getMachineController();
    const alphabet = machineController.getAlphabet();

    const showDefault = true;
    const showRecommended = !alphabet || alphabet.length <= 1;

    return (
      <div className={Style.tray_container}>
        <span className={Style.tray_used}>
          {alphabet.map(e => this.renderSymbol(e))}
        </span>
        <span className={Style.tray_default}>
          {showRecommended &&
            RECOMMENDED_SYMBOLS.map(e => this.renderSymbol(e))}
          {showDefault &&
            DEFAULT_SYMBOLS.map(e => this.renderSymbol(e))}
        </span>
      </div>
    );
  }
}

export default PDALabelEditorRenderer;
