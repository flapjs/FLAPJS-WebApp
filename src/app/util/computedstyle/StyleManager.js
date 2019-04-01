import StylePreset from './StylePreset.js';
import StyleEntryVariable from './StyleEntryVariable.js';

const DEFAULT_GROUP_NAME = "general";

class StyleManager
{
  constructor()
  {
    this._styles = new Map();
    this._groups = new Map();

    this._element = null;
    this._preset = null;
  }

  register(variableName, groupName=DEFAULT_GROUP_NAME)
  {
    this._styles.set(variableName, new StyleEntryVariable(this, variableName));
    if (this._groups.has(groupName))
    {
      this._groups.get(groupName).push(variableName);
    }
    else
    {
      this._groups.set(groupName, [variableName]);
    }
  }

  initialize(element)
  {
    this._element = element;
  }

  destroy()
  {
    this._element = null;
  }

  reset()
  {
    for(const style of this._styles.values())
    {
      style.resetValue();
    }
  }

  loadPreset(presetName)
  {
    StylePreset.fetchPresetFile(presetName, presetFile => {
      StylePreset.loadPresetFile(presetName, presetFile, preset => {
        this._preset = preset;
        for(const style of preset.getStyles())
        {
          const managedStyle = this.getStyleByName(style.getName());
          if (managedStyle)
          {
            managedStyle.setValue(style.getValue());
          }
        }
      });
    });
  }

  getComputedValue(variableName)
  {
    const computedStyle = window.getComputedStyle(this._element);
    const value = computedStyle.getPropertyValue(variableName);
    if (value)
    {
      return value;
    }
    else
    {
      return null;
      //throw new Error("Unable to find computed style for variable \'" + variableName + "\' in element");
    }
  }

  setComputedValue(variableName, value)
  {
    this._element.style.setProperty(variableName, value);
  }

  getPresetValue(variableName)
  {
    if (this._preset)
    {
      return this._preset.getStyle(variableName).getValue();
    }
    else
    {
      return null;
      //throw new Error("Unable to find style for variable \'" + variableName + "\' in missing preset");
    }
  }

  getValue(variableName)
  {
    if (this._styles.has(variableName))
    {
      return this._styles.get(variableName).getValue();
    }
    else
    {
      return this.getPresetValue(variableName) || this.getComputedValue(variableName);
    }
  }

  getStylesByGroup(groupName)
  {
    if (this._groups.has(groupName))
    {
      return this._groups.get(groupName).map(variableName => this._styles.get(variableName));
    }
    else
    {
      return null;
    }
  }

  getStyleByName(variableName)
  {
    if (this._styles.has(variableName))
    {
      return this._styles.get(variableName);
    }
    else
    {
      return null;
    }
  }
}

export default StyleManager;
