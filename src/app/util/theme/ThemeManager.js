import Theme from './Theme.js';
import SourceStyleEntry from './style/SourceStyleEntry.js';
import StyleEntry from './style/StyleEntry.js';

const DEFAULT_GROUP_NAME = "general";
const DEFAULT_THEME_NAME = "default";

class ThemeManager
{
  constructor()
  {
    this._styles = new Map();
    this._sourceStyles = new Map();
    this._groups = new Map();

    this._element = null;
    this._theme = null;
    this._defaultTheme = null;
  }

  register(variableName, groupName=DEFAULT_GROUP_NAME, styleEntry=null)
  {
    if (!styleEntry) styleEntry = new SourceStyleEntry(this, variableName);
    this._styles.set(variableName, styleEntry);

    if (styleEntry instanceof SourceStyleEntry)
    {
      this._sourceStyles.set(variableName, styleEntry);
    }

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
    for (const style of this._sourceStyles.values())
    {
      style.updateValue();
    }

    //Update default theme to current computed colors
    const styleMapping = new Map();
    let name, value;
    for (const style of this._styles.values())
    {
      name = style.getName();
      value = style.getValue();
      styleMapping.set(name, new StyleEntry(name, value));
    }
    this._defaultTheme = new Theme(DEFAULT_THEME_NAME, styleMapping);
  }

  destroy()
  {
    this._element = null;
  }

  reset()
  {
    for(const style of this._sourceStyles.values())
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
      return value.trim();
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
      return this._defaultTheme.getStyle(variableName).getValue();
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
      // return this.getThemeValue(variableName) || this.getComputedValue(variableName);
      return this.getComputedValue(variableName);
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

  getStyles()
  {
    return this._styles.values();
  }

  getSourceStyles()
  {
    return this._sourceStyles.values();
  }
}

export default ThemeManager;
