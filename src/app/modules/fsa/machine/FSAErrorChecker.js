class FSAErrorChecker
{
  constructor(fsa)
  {
    this._machine = fsa;
    this._errors = [];
  }

  checkErrors()
  {
    if (this._machine.isDeterministic())
    {
      return this.checkDFAErrors();
    }
    else
    {
      return this.checkNFAErrors();
    }
  }

  checkDFAErrors()
  {
    this._errors.length = 0;

    const nodeTransitions = new Map();

    return this._errors;
  }

  checkNFAErrors()
  {
    this._errors.length = 0;
    return this._errors;
  }
}
export default FSAErrorChecker;
