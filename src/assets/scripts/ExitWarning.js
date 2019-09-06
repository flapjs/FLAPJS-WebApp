window.addEventListener('beforeunload', (event) => 
{
    // if (window.shouldExitWarning)
    {
        const message = 'alert.warning.exit';
        event = event || window.event;
        // For IE and Firefox
        if (event) event.returnValue = message;
        // For Safari
        return message;
    }
});
