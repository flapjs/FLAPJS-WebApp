import LocalStorage from '@flapjs/util/storage/LocalStorage.js';

const PREVIOUS_MODULE_ID_KEY = 'prevModuleID';

class ModuleSaver
{
    hasPreviousModuleID()
    {
        return Boolean(LocalStorage.getData(PREVIOUS_MODULE_ID_KEY));
    }

    loadFromPreviousModuleID()
    {
        return LocalStorage.getData(PREVIOUS_MODULE_ID_KEY, 'base');
    }

    saveToPreviousModuleID(currentModuleID)
    {
        LocalStorage.setData(PREVIOUS_MODULE_ID_KEY, currentModuleID);
    }
}

export default ModuleSaver;
