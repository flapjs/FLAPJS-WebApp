/* eslint-disable no-console */

const LOG_TAG_TEXT = 'flapjs';
const LOG_TYPE_COLOR_MAP = {
    debug: '#7F8C8D',   // Gray
    log: '#2ECC71',     // Green
    warn: '#f39c12',    // Yellow
    error: '#c0392b',   // Red
};

function getLogTagStyle(logType)
{
    return [
        `background: ${LOG_TYPE_COLOR_MAP[logType]}`,
        'border-radius: 0.5em',
        'color: white',
        'font-weight: bold',
        'padding: 2px 0.5em'
    ];
}

function print(logType, ...messages)
{
    const logPrefix = [`%c${LOG_TAG_TEXT}`, getLogTagStyle(logType).join(';')];
    console[logType](...logPrefix, ...messages);
}

/**
 * A logging helper.
 */
class Logger
{
    /**
     * Logs the message.
     * 
     * @param {string} tag The tag that the message belongs to. This is usually the class name.
     * @param {string} message The message content.
     */
    static out(tag, message)
    {
        const result = '[' + tag + '] ' + message;
        print('log', result);
    }

    /**
     * Logs the error.
     * 
     * @param {string} tag The tag that the message belongs to. This is usually the class name.
     * @param {string} message The message content.
     * @param {Error} [err=null] The error message.
     */
    static error(tag, message, err = null)
    {
        const result = '[' + tag + '] ' + (err ? err.message + ' : ' : '') + message;
        print('error', result);
    }
}

export default Logger;
