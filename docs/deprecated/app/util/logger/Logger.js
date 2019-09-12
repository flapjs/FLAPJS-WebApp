/* eslint-disable no-console */

class Logger
{
    static out(tag, message)
    {
        const result = '[' + tag + '] ' + message;
        if (console && typeof console['log'] === 'function')
        {
            console['log'].call(result);
        }
    }

    static error(tag, message, err = null)
    {
        Logger.out(tag, (err ? err.message + ' : ' : '') + message);
    }
}

export default Logger;
