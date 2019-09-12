class TapeContext
{
    constructor(inputString, infiniteLeft=false, infiniteRight=false)
    {
        this._tapeInput = inputString ? inputString.split('') : [];
        this._left = infiniteLeft;
        this._right = infiniteRight;

        this._index = 0;
    }

    stepForward()
    {
        ++this._index;
    }

    stepBackward()
    {
        --this._index;
    }

    finish()
    {
        this._index = (this._tapeInput.length * 2);
    }

    reset()
    {
        this._index = -1;
    }

    stop()
    {
        this.finish();
        this.reset();
    }

    changeTapeSymbol(index, symbol='')
    {
        this._tapeInput[index] = symbol;
    }

    getTapeSourceStatesByIndex(index)
    {
        return null;
    }

    getTapeSymbolByIndex(index)
    {
        if (index < 0 || index >= this._tapeInput.length) return '';
        return this._tapeInput[index] || '';
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
        this._index = index;
    }

    getCurrentTapeIndex()
    {
        return this._index;
    }

    getTapeInput()
    {
        return this._tapeInput;
    }
}

export default TapeContext;
