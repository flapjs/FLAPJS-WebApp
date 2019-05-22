import React from 'react';

import TrashCan from 'deprecated/content/viewport/TrashCan.js';
import TestTray from './TestTray.js';
import CursorMode from 'deprecated/content/viewport/CursorMode.js';

class ViewportRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
    //Inherits props from parent
        const parent = this.props.parent;
        const currentModule = this.props.currentModule;
        const screen = this.props.screen;

        const inputController = currentModule.getInputController();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const tester = currentModule.getTestingManager();

        const LabelEditor = currentModule.getLabelEditor();

        return <span>
            { LabelEditor &&
      <LabelEditor ref={ref=>graphController.labelEditorElement=ref}
          inputController={inputController}
          graphController={graphController}
          machineController={machineController}
          screen={screen}/> }
            {
                tester.getStepByStepMode() ?
                    <div className="anchor-bottom-left" style={{width: '100%'}}>
                        <TestTray tester={tester} graphController={graphController}/>
                    </div>
                    :
                    <span>
                        <div className="anchor-bottom-left" style={{width: '100%'}}>
                            <CursorMode inputController={inputController} graphController={graphController}/>
                        </div>
                        <div className="anchor-bottom-right">
                            <TrashCan inputController={inputController} viewport={parent}/>
                        </div>
                    </span>
            }
        </span>;
    }
}
export default ViewportRenderer;
