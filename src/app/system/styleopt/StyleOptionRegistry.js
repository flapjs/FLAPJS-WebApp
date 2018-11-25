class StyleOption
{
  constructor(elementSource, propName, inputType, groupName, callback)
  {
    //the html element that this css variable reflects
    this.element = elementSource;
    //the name of the css variable
    this.prop = propName;
    //the css variable type
    this.type = inputType;
    //the group that the variable belongs to ("default" if not specified)
    this.group = groupName;

    this._callback = callback;
    this._value = null;
    this._defaultValue = null;
  }

  /**
   * Update the current value to reflect the computed style's value.
   */
  updateStyle(computedStyle=null, shouldPropagateChange=true)
  {
    if (!computedStyle)
    {
      computedStyle = window.getComputedStyle(this.element);
    }
    const newValue = computedStyle.getPropertyValue(this.prop);
    if (!newValue)
    {
      throw new Error("Cannot find style option with prop name \'" + this.prop + "\' for element");
    }

    this._value = newValue.trim();
    this._defaultValue = this._value;
    if (shouldPropagateChange && this._callback) this._callback(this, newValue);
  }

  /**
   * Reset the current value to reflect the computed style's value.
   */
  resetStyle()
  {
    this.setStyle(this._defaultValue);
  }

  /**
   * Changes the variable's value for prop name.
   * These changes are reflected to the css source.
   */
  setStyle(val, shouldPropagateChange=true)
  {
    this._value = val;
    this.element.style.setProperty(this.prop, val);

    if (shouldPropagateChange && this._callback) this._callback.call(null, this, val);
  }

  /** Returns the variable's current value. Null if not yet initialized. */
  getStyle()
  {
    return this._value;
  }

  isDefaultStyle()
  {
    return this._value == this._defaultValue;
  }
}

class StyleOptionRegistry
{
  constructor()
  {
    this._options = new Map();
    this._groups = new Map();

    this._init = false;
  }

  registerStyleOption(elementSource, propName, inputType="text", groupName="default", changeCallback=null)
  {
    if (this._options.has(propName))
    {
      throw new Error("Style option with prop name \'" + propName + "\' already registered");
    }

    const result = new StyleOption(elementSource, propName, inputType, groupName, changeCallback);
    this._options.set(propName, result);

    let group;
    if (!this._groups.has(groupName))
    {
      group = [];
      this._groups.set(groupName, group);
    }
    else
    {
      group = this._groups.get(groupName);

      if (group.indexOf(propName) != -1)
      {
        //Ignore it, it's already in here
        return;
      }
    }
    group.push(propName);
  }

  unregisterStyleOption(propName)
  {
    if (this._options.has(propName))
    {
      const option = this._options.get(propName);
      this._options.delete(propName);
      const groupName = option.group;
      if (this._groups.has(groupName))
      {
        const group = this._groups.get(groupName);
        const index = group.indexOf(propName);
        if (index >= 0)
        {
          group.splice(index, 1);
        }
      }
    }
  }

  initialize()
  {
    if (this._init)
    {
      throw new Error("Already initialized");
    }

    //Compute the styles
    const computedStyles = {};
    let computedStyle;
    for(let option of this._options.values())
    {
      const element = option.element;
      computedStyle = computedStyles[element];
      if (!computedStyle)
      {
        computedStyle = window.getComputedStyle(element);
        computedStyles[element] = computedStyle;
      }
      option.updateStyle(computedStyle, false);
    }

    this._init = true;
  }

  terminate()
  {
    if (!this._init)
    {
      throw new Error("Not yet initialized");
    }

    this._options.clear();
    this._groups.clear();

    this._init = false;
  }

  getOptionByProp(propName)
  {
    return this._options.get(propName);
  }

  getPropsByGroup(groupName)
  {
    return this._groups.get(groupName) || [];
  }

  getOptions()
  {
    return this._options.values();
  }

  isEmpty()
  {
    return this._options.size <= 0;
  }
}

export default StyleOptionRegistry;
