import StyleEntry from './StyleEntry.js';

class SourceStyleEntry extends StyleEntry
{
  constructor(styleManager, variableName)
  {
    super(variableName, "#FFFFFF");
    this._styleManager = styleManager;
    this._name = variableName;

    this._value = "#FFFFFF";
  }

  updateValue()
  {
    this._value = this._styleManager.getComputedValue(this._name);
  }

  resetValue()
  {
    this.setValue(this._styleManager.getDefaultValue(this._name));
  }

  setValue(value)
  {
    this._value = value;
    this._styleManager.setComputedValue(this._name, value);
  }

  getStyleManager() { return this._styleManager; }
}

export default SourceStyleEntry;
