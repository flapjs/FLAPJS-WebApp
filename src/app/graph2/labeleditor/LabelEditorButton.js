import React from 'react';
import DebounceButton from 'graph2/components/widgets/formatter/DebounceButton.js';

class LabelEditorButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <DebounceButton {...this.props}
                parent={this.props.parent.getDebounceComponent()}>
                {this.props.children}
            </DebounceButton>
        );
    }
}

export default LabelEditorButton;