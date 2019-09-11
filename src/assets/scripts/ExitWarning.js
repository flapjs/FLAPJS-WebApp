/* global NODE_ENV */

window.addEventListener('beforeunload', (event) => 
{
    // if (window.shouldExitWarning)
    if (NODE_ENV === 'production')
    {
        const message = 'alert.warning.exit';
        event = event || window.event;
        // For IE and Firefox
        if (event) event.returnValue = message;
        // For Safari
        return message;
    }
});
