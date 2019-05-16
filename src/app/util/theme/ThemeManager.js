import Theme from './Theme.js';
import SourceStyleEntry from './style/SourceStyleEntry.js';

const DEFAULT_GROUP_NAME = 'general';
const DEFAULT_THEME_NAME = 'default';
// const COMPUTED_THEME_NAME = 'computed';

class ThemeManager
{
    constructor()
    {
        this._styles = new Map();
        this._groups = new Map();
        this._element = null;
        this._elementTheme = null;

        this._theme = null;
    }

    register(variableName, groupName = DEFAULT_GROUP_NAME, sourceStyle = null, sourceTransform = null)
    {
        const styleEntry = new SourceStyleEntry(this, variableName, sourceStyle, sourceTransform);
        if (this._element)
        {
            const computedValue = this.getComputedValue(variableName);
            styleEntry.setValue(computedValue, false);
            this._elementTheme.addStyle(variableName, computedValue);
        }
        this._styles.set(variableName, styleEntry);

        if (this._groups.has(groupName))
        {
            this._groups.get(groupName).push(variableName);
        }
        else
        {
            this._groups.set(groupName, [variableName]);
        }
        return styleEntry;
    }

    unregister(variableName)
    {
        this._styles.delete(variableName);

        for (const styleGroup of this._groups.values())
        {
            const index = styleGroup.indexOf(variableName);
            if (index >= 0)
            {
                styleGroup.splice(index, 1);
            }
        }

        if (this._element)
        {
            this._elementTheme.removeStyle(variableName);
        }
    }

    clear()
    {
        this._groups.clear();
        this._styles.clear();
        this._element = null;
        this._elementTheme = null;
    }

    setElement(element)
    {
        this._element = element;
        this._elementTheme = new Theme(DEFAULT_THEME_NAME);
        for (const style of this._styles.values())
        {
            style.setValue(this.getComputedValue(style.getName()), false);
        }
        return this;
    }

    reset()
    {
        const theme = this._theme || this._elementTheme;
        if (theme)
        {
            for (const style of this._styles.values())
            {
                const styleName = style.getName();
                const themeStyle = theme.getStyleByName(styleName);
                if (themeStyle)
                {
                    style.setValue(themeStyle.getValue());
                }
                else if (style.getSourceStyle())
                {
                    style.updateValue();
                }
                else if (theme !== this._elementTheme)
                {
                    const elementStyle = this._elementTheme.getStyleByName(styleName);
                    if (elementStyle)
                    {
                        style.setValue(elementStyle.getValue());
                    }
                }
            }
        }
    }

    loadTheme(themeName)
    {
        if (this._theme && this._theme.getName() === themeName)
        {
            this.reset();
        }
        else if (themeName === DEFAULT_THEME_NAME)
        {
            this._theme = this._elementTheme;
            this.reset();
        }
        else
        {
            Theme.fetchThemeFile(themeName, (themeFile) => 
            {
                Theme.loadThemeFile(themeName, themeFile, (theme) => 
                {
                    this._theme = theme;
                    this.reset();
                });
            });
        }
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
        }
    }

    setComputedValue(variableName, value)
    {
        this._element.style.setProperty(variableName, value);
    }

    getValue(variableName)
    {
        if (this._styles.has(variableName))
        {
            return this._styles.get(variableName).getValue();
        }
        else
        {
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

    getStyleNames()
    {
        return this._styles.keys();
    }

    getStyleGroupNames()
    {
        return this._groups.keys();
    }

    getCurrentTheme()
    {
        return this._theme || this._elementTheme;
    }
}

export default ThemeManager;