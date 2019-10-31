import React from 'react';
import PropTypes from 'prop-types';

import * as ThemeHandler from './ThemeHandler.js';
import StyleRegistry from './StyleRegistry.js';

import * as ElementHelper from '@flapjs/util/ElementHelper.js';

// The registry to hold all known style relationships.
export const STYLE_REGISTRY = new StyleRegistry();

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = createThemeContextState(null, null);

// Behold...the theme context.
const ThemeContext = React.createContext(DEFAULT_CONTEXT_VALUE);

// ...and it's provider...
class ThemeProvider extends React.Component
{
    /** @override */
    static getDerivedStateFromProps(props, state)
    {
        // This shouldn't happen that often... (at most like once)
        if (props.source !== state.source)
        {
            const newSource = props.source;
            const newElement = newSource ? ElementHelper.getElementFromRef(newSource) : null;
            return {
                source: newSource,
                initialStyleMap: ThemeHandler.getInitialStyleMapForElement(newElement),
                computedStyleMap: ThemeHandler.getComputedStyleMapForElement(newElement),
            };
        }

        return null;
    }

    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateTheme = true;

        // This should match the expected shape for the consumers.
        this.state = createThemeContextState(this, props.source);
    }

    /** @override */
    componentDidMount()
    {
        this.state.changeTheme(this.props.themeName);
    }

    /** @override */
    componentWillUnmount()
    {
        // Don't update this component anymore, cause IT'S DEAD!
        this.shouldUpdateTheme = false;
    }

    /** @override */
    render()
    {
        return (
            <ThemeContext.Provider value={this.state}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}
ThemeProvider.propTypes = {
    themeName: PropTypes.string,
    children: PropTypes.node,
    source: PropTypes.oneOfType([
        PropTypes.shape({
            current: PropTypes.instanceOf(Element)
        }),
        PropTypes.func,
    ]).isRequired,
};
ThemeProvider.defaultProps = {
    themeName: DEFAULT_CONTEXT_VALUE.themeName,
};

/**
 * Creates a context state. This helps maintain a consistant shape for all theme contexts.
 *
 * @param provider
 * @param source
 * @param defaultThemeName
 */
function createThemeContextState(provider, source, defaultThemeName = 'default')
{
    const element = source ? ElementHelper.getElementFromRef(source) : null;
    if (element)
    {
        STYLE_REGISTRY.setActive(true);
    }

    return {
        themeName: defaultThemeName,
        source: source,
        registry: STYLE_REGISTRY,
        getStyle: ThemeHandler.getStyle.bind(null, provider),
        hasStyle: ThemeHandler.hasStyle.bind(null, provider),
        changeTheme: ThemeHandler.changeTheme.bind(null, provider),
        initialStyleMap: ThemeHandler.getInitialStyleMapForElement(element),
        computedStyleMap: ThemeHandler.getComputedStyleMapForElement(element),
    };
}

export { ThemeProvider };
// ...and its consumers...
export const ThemeConsumer = ThemeContext.Consumer;
// Not much use for the context, so it's just a default export.
export default ThemeContext;
