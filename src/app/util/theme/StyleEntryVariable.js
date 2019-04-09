import StyleEntry from './StyleEntry.js';

class StyleEntryVariable extends StyleEntry
{
  constructor(styleManager, variableName)
  {
    this._styleManager = styleManager;
    this._name = variableName;

    this._cachedValue = "#FFFFFF";
  }

  updateValue()
  {
    this._cachedValue = this._styleManager.getComputedValue(this._name);
  }

  resetValue()
  {
    this.setValue(this._styleManager.getDefaultValue(this._name));
  }

  setValue(value)
  {
    this._cachedValue = value;
    this._styleManager.setComputedValue(this._name, value);
  }

  //Override
  getValue() { return this._cachedValue; }
  //Override
  getName() { return this._name; }

  getStyleManager() { return this._styleManager; }
}

export default StyleEntryVariable;
