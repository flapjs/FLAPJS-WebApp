class StyleEntry
{
    constructor(name, value)
    {
        this._name = name;
        this._value = value;
    }

    getValue() { return this._value; }
    getName() { return this._name; }
}

export default StyleEntry;
