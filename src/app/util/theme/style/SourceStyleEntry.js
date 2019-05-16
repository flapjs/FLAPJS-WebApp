import StyleEntry from './StyleEntry.js';

class SourceStyleEntry extends StyleEntry
{
    constructor(styleManager, variableName, sourceStyle=null, sourceTransform=null)
    {
        super(variableName, styleManager.getComputedValue(variableName));
        this._styleManager = styleManager;
        this._children = [];

        //Since children are ONLY updated in the constructor, they are never removed
        if (sourceStyle)
        {
            this._source = sourceStyle;
            sourceStyle._children.push(this);
        }

        //This is useless without sourceStyle, but hey, you do you.
        this._sourceTransform = sourceTransform;
    }

    updateValue(propagateChange=true)
    {
        if (this._source)
        {
            const sourceValue = this._source.getValue();
            if (this._sourceTransform)
            {
                const newValue = this._sourceTransform.call(this, sourceValue);
                this._value = newValue;
            }
            else
            {
                this._value = sourceValue;
            }

            if (propagateChange)
            {
                this._styleManager.setComputedValue(this._name, this._value);
                for(const child of this._children)
                {
                    child.updateValue(true);
                }
            }
        }
    }

    setValue(value, propagateChange=true)
    {
        this._value = value;

        if (propagateChange)
        {
            this._styleManager.setComputedValue(this._name, value);
            for(const child of this._children)
            {
                child.updateValue(true);
            }
        }
    }

    getSourceStyle() { return this._source; }
    getSourceTransform() { return this._sourceTransform; }
    getDerivedStyles() { return this._children; }
    getStyleManager() { return this._styleManager; }
}

export default SourceStyleEntry;
