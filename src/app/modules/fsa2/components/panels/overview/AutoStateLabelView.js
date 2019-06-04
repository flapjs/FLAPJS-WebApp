import React from 'react';
import Style from './AutoStateLabelView.css';

import FormattedInput from 'deprecated/system/formattedinput/FormattedInput.js';

class AutoStateLabelView extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onAutoStatePrefixSubmit = this.onAutoStatePrefixSubmit.bind(this);
        this.onAutoStatePrefixFormat = this.onAutoStatePrefixFormat.bind(this);
    }

    onAutoStatePrefixSubmit(next, prev)
    {
        const graphController = this.props.graphController;
        const graphLabeler = graphController.getGraphLabeler();

        const prefix = graphLabeler.getDefaultNodeLabelPrefix();
        if (prefix != next)
        {
            graphLabeler.setDefaultNodeLabelPrefix(next);
            graphController.applyAutoRename();
        }
    }

    onAutoStatePrefixFormat(value)
    {
        return value && value.length > 0 ? value :
            this.props.graphController.getGraphLabeler().getDefaultNodeLabelPrefix();
    }

    /** @override */
    render()
    {
        const graphController = this.props.graphController;

        return (
            <div id={this.props.id}
                className={Style.select_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <label className={Style.select_label}>
          State Labels
                </label>
                <FormattedInput
                    className={Style.prefix_editor}
                    defaultValue={graphController.getGraphLabeler().getDefaultNodeLabelPrefix()}
                    captureOnExit="save"
                    formatter={this.onAutoStatePrefixFormat}
                    onSubmit={this.onAutoStatePrefixSubmit}/>
                <select className={Style.postfix_selector}
                    onChange={this.onMachineTypeChange}
                    disabled={true}>
                    <option>0-9</option>
                    <option>a-z</option>
                    <option>A-Z</option>
                </select>
            </div>
        );
    }
}

export default AutoStateLabelView;
