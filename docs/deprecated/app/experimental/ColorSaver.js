import AbstractAutoSaveHandler from 'util/storage/AbstractAutoSaveHandler.js';

export const THEME_STORAGE_ID = 'prefs-theme';
export const COLOR_STORAGE_ID = 'prefs-color';

class ColorSaver extends AbstractAutoSaveHandler
{
    constructor(themeManager)
    {
        super();

        this._themeManager = themeManager;
    }

    /** @override */
    onAutoSaveLoad(dataStorage)
    {
        const themeManager = this._themeManager;
        // const theme = dataStorage.getData(THEME_STORAGE_ID);
        const data = dataStorage.getDataAsObject(COLOR_STORAGE_ID);

        for (const key in data)
        {
            const style = themeManager.getStyleByName(key);
            if (style)
            {
                style.setValue(data[key]);
            }
        }
    }

    /** @override */
    onAutoSaveUnload(dataStorage)
    {
        //Don't do anything...
    }

    /** @override */
    onAutoSaveUpdate(dataStorage)
    {
        const themeManager = this._themeManager;
        const data = {};

        const theme = themeManager.getCurrentTheme();
        for (const style of themeManager.getStyles())
        {
            const styleName = style.getName();
            const styleValue = style.getValue();

            //TODO: Just save everything, unless we can somehow cache theme files...
            /*
            if (theme)
            {
                const themeStyle = theme.getStyleByName(styleName);
                if (themeStyle && themeStyle.getValue() === styleValue)
                {
                continue;
                }
            }
            */

            data[styleName] = styleValue;
        }
        dataStorage.setDataAsObject(COLOR_STORAGE_ID, data);
        dataStorage.setData(THEME_STORAGE_ID, theme.getName());
    }

    getThemeManager()
    {
        return this._themeManager;
    }
}

export default ColorSaver;