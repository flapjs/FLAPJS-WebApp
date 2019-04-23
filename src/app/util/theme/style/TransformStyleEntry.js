import StyleEntry from './StyleEntry.js';

class TransformStyleEntry extends StyleEntry
{
  constructor(name, sourceStyle, transformFunction)
  {
    super(name, sourceStyle.getValue());

    this._source = sourceStyle;
    this._transform = transformFunction;
  }

  //Override
  getValue()
  {
    this._value = this._transform.call(this, this._source.getValue());
    console.log(this.getName() + ":" + this._value);
    // this._source.setValue(this._value);
    return this._value;
  }

  getSourceStyle() { return this._source; }
  getTransformFunction() { return this._transform; }
}

export default TransformStyleEntry;
