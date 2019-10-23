/** Used as a template for AutoSaveManager handlers. */
class AbstractAutoSaveHandler
{
    onAutoSaveLoad(storage) {}
    onAutoSaveUpdate(storage) {}
    onAutoSaveUnload(storage) {}
}

export default AbstractAutoSaveHandler;
