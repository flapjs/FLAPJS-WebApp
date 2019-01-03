class TapeContext
{
  constructor(inputString, infiniteLeft=false, infiniteRight=false)
  {
    this._tapeInput = inputString.split('');
    this._tapeFroms = new Array(this._tapeInput.length);
    this._left = infiniteLeft;
    this._right = infiniteRight;

    this._currentIndex = 0;
  }

  setTapeSymbol(index, symbol="")
  {
    this._tapeInput[index] = symbol;
  }

  setTapeSourceStates(index, sourceStates=[])
  {
    this._tapeFroms[index] = sourceStates;
  }

  getTapeSourceStatesByIndex(index)
  {
    if (index < 0 || index >= this._tapeFroms.length) return [];
    return this._tapeFroms[index] || [];
  }

  getTapeSymbolByIndex(index)
  {
    if (index < 0 || index >= this._tapeInput.length) return "";
    return this._tapeInput[index] || "";
  }

  isTapeLeftInfinite()
  {
    return this._left;
  }

  isTapeRightInfinite()
  {
    return this._right;
  }

  setCurrentTapeIndex(index)
  {
    this._currentIndex = index;
  }

  getCurrentTapeIndex()
  {
    return this._currentIndex;
  }

  getTapeInput()
  {
    return this._tapeInput;
  }
}

export default TapeContext;
