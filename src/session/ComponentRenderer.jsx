import React from 'react';

export function createComponentEntry(componentClass, componentProps)
{
    return { component: componentClass, props: componentProps };
}

export function renderComponentEntry(componentEntry, componentProps, children = undefined)
{
    // Render entries: { component: ComponentClass, props: {...} }
    if (typeof componentEntry === 'object')
    {
        return React.createElement(componentEntry.component, {
            ...componentProps,
            ...componentEntry.props
        }, children);
    }
    // Render entries: ComponentClass
    else if (typeof componentEntry === 'function')
    {
        return React.createElement(componentEntry, componentProps, children);
    }
    // Render entries: null / undefined
    else
    {
        return null;
    }
}

export function renderComponentEntries(componentClasses, componentProps = {})
{
    if (Array.isArray(componentClasses))
    {
        const result = [];
        const length = componentClasses.length;
        for(let i = 0; i < length; ++i)
        {
            const component = componentClasses[i];
            const element = renderComponentEntry(component, {
                key: i + ':' + component.name,
                ...componentProps
            });
            if (element)
            {
                result.push(element);
            }
        }

        if (result.length <= 1)
        {
            return result[0];
        }
        else
        {
            return result;
        }
    }
    else if (componentClasses)
    {
        return renderComponentEntry(componentClasses, componentProps);
    }
    else
    {
        return null;
    }
}

export function renderNestedComponentEntries(componentClasses, componentProps, children)
{
    if (Array.isArray(componentClasses))
    {
        let result = null;
        for(let i = componentClasses.length - 1; i >= 0; --i)
        {
            const componentClass = componentClasses[i];
            result = renderComponentEntry(componentClass, componentProps, result || children);
        }
        return result || children;
    }
    else if (typeof componentClasses === 'function')
    {
        return renderComponentEntry(componentClasses, componentProps, children);
    }
    else
    {
        return children;
    }
}
