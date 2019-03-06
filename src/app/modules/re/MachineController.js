import {stringHash} from 'util/MathHelper.js';

import RE from './machine/RE.js';
import {convertToNFA} from './machine/REUtils.js';

import ExpressionChangeHandler from './ExpressionChangeHandler.js';

const EXPRESSION_REFRESH_RATE = 30;

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
  }

  getMachineExpression()
  {
    return this._machine.getExpression();
  }

  getMachine()
  {
    return this._machine;
  }

  getExpressionChangeHandler()
  {
    return this._graphChangeHandler;
  }
}

export default MachineController;
