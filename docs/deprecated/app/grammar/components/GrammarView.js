import React from 'react';
import Style from './GrammarView.css';

import FormattedInput from 'graph2/components/widgets/formatter/FormattedInput.js';

class GrammarView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const multiline = this.props.multiline;

        return (
            <div className={Style.grammar_container}>
                <div className={Style.grammar_space}></div>
                <FormattedInput
                    className={Style.grammar_input +
                        (multiline ? ' multiline ' : '')}
                    multiline={multiline}
                    onClick={this.onClick}
                    onChange={this.onChange}>
                </FormattedInput>
                <div className={Style.grammar_space}></div>
            </div>
        );
    }
}

export default GrammarView;