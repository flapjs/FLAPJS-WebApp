import AbstractAutoSaveHandler from 'util/storage/AbstractAutoSaveHandler.js';

export const LANG_STORAGE_ID = 'prefs-lang';

class LanguageSaver extends AbstractAutoSaveHandler
{
    constructor() { super(); }

    /** @override */
    onAutoSaveLoad(dataStorage)
    {
        const data = dataStorage.getDataAsObject(LANG_STORAGE_ID);
        if (!data) return;

        for (const key of Object.keys(data))
        {
            I18N.languageMapping.set(key, data[key]);
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
        const data = {};
        for (const key of I18N.languageMapping.keys())
        {
            data[key] = I18N.languageMapping.get(key);
        }
        dataStorage.setDataAsObject(LANG_STORAGE_ID, data);
    }
}

export default LanguageSaver;
