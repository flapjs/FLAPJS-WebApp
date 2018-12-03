import React from 'react';

class NFAToDFAConversionWarningMessage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        const message = this.props.message;
        const buttonValue = e.target.value;

        switch(buttonValue)
        {
            case "convert":
                {
                    const machineController = this.props.machineController;
                    machineController.convertMachineTo("DFA");
                    message.close();
                }
            break;
            default:
              throw new Error("Unknown button value for message");
        }
    }

    render()
    {
        const machineController = this.props.machineController;
        const machine = machineController.getMachineBuilder().getMachine();
        const stateCount = machine.getStates().length;

        return <div>
          <p>{I18N.toString("message.warning.convertNFAToDFA")}</p>
          <p>{`${stateCount} states -> ${Math.pow(2, stateCount)} states`}</p>
          <button value="convert" onClick={this.onClick}>{I18N.toString("message.action.convert")}</button>
        </div>;

    }
}

export default NFAToDFAConversionWarningMessage;
