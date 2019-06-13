/**
 * A wrapper for a more intuitive use of SessionStorage.
 * @module SessionStorage
 */
const SessionStorage = {
    clear()
    {
        if (!this.isSupported()) return;
        sessionStorage.clear();
    },
    setData(key, value)
    {
        if (!this.isSupported()) return;

        // Opera 12.10 and Firefox 18 and later support
        let hidden;
        if (typeof document.hidden !== 'undefined')
        {
            hidden = 'hidden';
        }
        else if (typeof document.msHidden !== 'undefined')
        {
            hidden = 'msHidden';
        }
        else if (typeof document.webkitHidden !== 'undefined')
        {
            hidden = 'webkitHidden';
        }

        //Don't save anything if hidden...
        if (document[hidden]) return;

        if (value)
        {
            sessionStorage.setItem(key, value);
        }
        else
        {
            sessionStorage.removeItem(key);
        }
    },
    getData(key, defaultValue=null)
    {
        if (!this.isSupported()) return defaultValue;
        return sessionStorage.getItem(key) || defaultValue;
    },
    setDataAsObject(key, objectValue)
    {
        try
        {
            if (objectValue && Object.keys(objectValue).length > 0)
            {
                this.setData(key, JSON.stringify(objectValue));
            }
            else
            {
                this.setData(key, null);
            }
        }
        catch (e)
        {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    },
    getDataAsObject(key, defaultValue=null)
    {
        const result = this.getData(key, null);
        if (result)
        {
            try
            {
                return JSON.parse(result);
            }
            catch (e)
            {
                // eslint-disable-next-line no-console
                console.error(e);
                return defaultValue;
            }
        }
        else
        {
            return defaultValue;
        }
    },
    isSupported()
    {
        return typeof sessionStorage !== 'undefined';
    }
};

export default SessionStorage;
