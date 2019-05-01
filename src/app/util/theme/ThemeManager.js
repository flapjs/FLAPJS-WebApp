import Theme from './Theme.js';
import StyleEntryVariable from './StyleEntryVariable.js';

const DEFAULT_GROUP_NAME = "general";

class ThemeManager
{
  constructor()
  {
    this._styles = new Map();
    this._groups = new Map();

    this._element = null;
    this._theme = null;
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

  loadTheme(themeName)
  {
    Theme.fetchThemeFile(themeName, themeFile => {
      Theme.loadThemeFile(themeName, themeFile, theme => {
        this._theme = theme;
        for(const style of theme.getStyles())
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

  getDefaultValue(variableName)
  {
    if (this._theme)
    {
      return this._theme.getStyle(variableName).getValue();
    }
    else
    {
      return null;
      //throw new Error("Unable to find style for variable \'" + variableName + "\' in missing theme");
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
      return this.getThemeValue(variableName) || this.getComputedValue(variableName);
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

export default ThemeManager;
