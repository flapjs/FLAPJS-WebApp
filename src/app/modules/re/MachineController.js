import {stringHash} from 'util/MathHelper.js';

import RE from './machine/RE.js';
import {convertToNFA} from './machine/REUtils.js';

import ExpressionChangeHandler from './ExpressionChangeHandler.js';

import Notifications from 'system/notification/Notifications.js';

const EXPRESSION_REFRESH_RATE = 30;
const ERROR_MESSAGE_TAG = "re_parse_error"

class MachineController
{
  constructor()
  {
    this._machine = new RE();
    this._expressionChangeHandler = new ExpressionChangeHandler(EXPRESSION_REFRESH_RATE);

    this._equalFSA = null;
    this._equalREHash = stringHash(this._machine.getExpression());
  }

  update()
  {
    this._expressionChangeHandler.update(this._machine.getExpression());
  }

  clear()
  {
    this.setMachineExpression("");
  }

  isSymbol(symbol)
  {
    return false;
  }

  isUsedSymbol(symbol)
  {
    return this.isSymbol(symbol);
  }

  renameSymbol(symbol, nextSymbol)
  {
    const prevExpression = this._machine.getExpression();
    const nextExpression = prevExpression.replace(symbol, nextSymbol);
    this.setMachineExpression(nextExpression);
  }

  deleteSymbol(symbol)
  {
    const prevExpression = this._machine.getExpression();
    const nextExpression = prevExpression.replace(symbol, '');
    this.setMachineExpression(nextExpression);
  }

  getMachineTerminals()
  {
    return [];
  }

  getEquivalentFSA()
  {
    if (!this._equalFSA || (stringHash(this._machine.getExpression()) !== this._equalREHash))
    {
      this._equalREHash = stringHash(this._machine.getExpression());
      this._equalFSA = convertToNFA(this._machine);
    }
    return this._equalFSA;
  }

  setMachineExpression(string)
  {
    this._machine.setExpression(string);
    this._machine.validate();
  }

  getMachineExpression()
  {
    return this._machine.getExpression() || "";
  }

  getMachineErrors()
  {
    return this._machine.getErrors();
  }

  getMachine()
  {
    return this._machine;
  }

  getExpressionChangeHandler()
  {
    return this._expressionChangeHandler;
  }
}

export default MachineController;
