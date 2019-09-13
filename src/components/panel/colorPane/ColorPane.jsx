import React from 'react';
import PropTypes from 'prop-types';

import Pane from '../pane/Pane.jsx';
import ColorEntry from './ColorEntry.jsx';
import ColorSubEntry from './ColorSubEntry.jsx';

import StyleInput from '../../theme/sourceStyle/StyleInput.jsx';
import ComputedStyleInput from '../../theme/computedStyle/ComputedStyleInput.jsx';

/**
 * A React component to hold all color changing options.
 */
class ColorPane extends React.Component
{
    constructor(props)
    {
        super(props);

        this.primary = React.createRef();
        this.accent = React.createRef();
        this.contentMain = React.createRef();
    }
    
    /** @override */
    render()
    {
        const props = this.props;

        const source = props.source;

        return (
            <Pane className={props.className || ''} title="Color">
                <ColorEntry title="Primary">
                    <StyleInput ref={this.primary} source={source} name="--primary"/>
                </ColorEntry>
                <ColorSubEntry title="Primary (Dark)">
                    <ComputedStyleInput source={source} name="--primary-dark"
                        compute={this.primary}
                        computeFunction="darken" />
                </ColorSubEntry>

                <ColorEntry title="Accent">
                    <StyleInput ref={this.accent} source={source} name="--accent"/>
                </ColorEntry>
                <ColorSubEntry title="Accent (Dark)">
                    <ComputedStyleInput source={source} name="--accent-dark"
                        compute={this.accent}
                        computeFunction="darken" />
                </ColorSubEntry>
                
                <ColorEntry title="Main Content">
                    <StyleInput ref={this.contentMain} source={source} name="--content-main"/>
                </ColorEntry>
            </Pane>
        );
    }
}

ColorPane.propTypes = {
    className: PropTypes.string,
    source: PropTypes.oneOfType([
        PropTypes.shape({
            current: PropTypes.instanceOf(Element)
        }),
        PropTypes.func,
    ]).isRequired,
};
ColorPane.defaultProps = {
};

export default ColorPane;
