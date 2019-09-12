import React from 'react';
import DefaultNotificationLayout, { STYLE_TYPE_WARNING } from 'session/manager/notification/components/DefaultNotificationLayout.js';

// TODO: specify what the class does
class NFAToDFAConversionNotificationLayout extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        const notification = this.props.notification;
        // TODO: specify what e is
        switch (e.target.value)
        {
        case 'convert':
            {
                //FIXME: FSABUILDER: convertMachineTo needs to change?
                const machineController = this.props.machineController;
                machineController.convertMachineTo('DFA');
                notification.close();
            }
            break;
        }
    }

    /** @override */
    render()
    {
        // TODO: clarify machineController?
        const machineController = this.props.machineController;
        const stateCount = machineController.countStates();

        return (
            <DefaultNotificationLayout id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                styleType={STYLE_TYPE_WARNING}
                notification={this.props.notification}>
                <p>{I18N.toString('message.warning.convertNFAToDFA')}</p>
                <p>{`${stateCount} states -> ${Math.pow(2, stateCount)} states`}</p>
                <button value="convert" onClick={this.onClick}>
                    {I18N.toString('message.action.convert')}
                </button>
            </DefaultNotificationLayout>
        );
    }
}

export default NFAToDFAConversionNotificationLayout;
