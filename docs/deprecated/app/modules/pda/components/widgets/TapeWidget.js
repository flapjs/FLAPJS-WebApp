import React from 'react';
import Style from './TapeWidget.css';

import DownArrowIcon from 'components/iconset/DownArrowIcon.js';

const TAPE_INFINITE_LEFT = true;
const TAPE_INFINITE_RIGHT = true;

class TapeWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onTapeStepBackward = this.onTapeStepBackward.bind(this);
        this.onTapeStepForward = this.onTapeStepForward.bind(this);
        this.onTapeFinish = this.onTapeFinish.bind(this);
        this.onTapeReset = this.onTapeReset.bind(this);
        this.onTapeSkipForward = this.onTapeSkipForward.bind(this);
        this.onTapeSkipBackward = this.onTapeSkipBackward.bind(this);
        this.onTapeStop = this.onTapeStop.bind(this);
    }

    onTapeStepBackward(e)
    {
        const tapeContext = this.props.value;
        tapeContext.stepBackward();
    }

    onTapeStepForward(e)
    {
        const tapeContext = this.props.value;
        tapeContext.stepForward();
    }

    onTapeSkipForward(e)
    {
    }

    onTapeSkipBackward(e)
    {
    }

    onTapeReset(e)
    {
        const tapeContext = this.props.value;
        tapeContext.reset();
    }

    onTapeFinish(e)
    {
        const tapeContext = this.props.value;
        tapeContext.finish();
    }

    onTapeStop(e)
    {
        const tapeContext = this.props.value;
        tapeContext.stop();
    }

    /** @override */
    render()
    {
        const showTransitionStates = true;
        const tapeContext = this.props.value;
        const tapeIndex = tapeContext ? tapeContext.getCurrentTapeIndex() : -1;

        if (!tapeContext) return null;

        return (
            <div id={this.props.id}
                className={Style.tape_container +
                    ' ' + this.props.className}
                style={this.props.style}>

                <div className={Style.tape_control_tray}>
                    <button onClick={this.onTapeStepBackward}>BACK</button>
                    <button onClick={this.onTapeStepForward}>STEP</button>
                    <button onClick={this.onTapeReset}>RESET</button>
                    <button onClick={this.onTapeFinish}>TO END</button>
                </div>

                <div className={Style.tape_control_tray}>
                    <button onClick={this.onTapeSkipForward}>SKIP TO NEXT</button>
                    <button onClick={this.onTapeSkipBackward}>SKIP TO PREV</button>
                    <button onClick={this.onTapeStop}>STOP</button>
                </div>

                <div className={'tape-row'}>

                    {TAPE_INFINITE_LEFT && tapeContext.isTapeLeftInfinite() &&
                        <div className="tape-row-entry infinite">
                            <span className="tape-row-states"></span>
                            <label className="tape-row-symbol">{'...'}</label>
                        </div>}

                    <DownArrowIcon
                        className="tape-pointer"
                        style={{ opacity: tapeIndex < 0 ? 0 : 1, left: tapeIndex + 'em' }} />

                    {tapeContext.getTapeInput().map((e, i) => 
                    {
                        let active = false;
                        let activeRead = false;
                        active = tapeIndex === i;
                        activeRead = tapeIndex === i - 1;
                        /*
                        const currentIndex = Math.floor(tapeIndex / 2);
                        if (currentIndex === i)
                        {
                        //It's the current index...
                        active = tapeIndex % 2 === 1;
                        activeRead = tapeIndex % 2 === 0;
                        }
                        else if (currentIndex === i + 1)
                        {
                        //It's the previous index...
                        active = tapeIndex % 2 === 0;
                        }
                        */

                        const sourceStates = tapeContext.getTapeSourceStatesByIndex(i);
                        const disabled = sourceStates === null;
                        return (
                            <div key={e + ':' + i} className={'tape-row-entry' +
                                (active ? ' active ' : '') +
                                (activeRead ? ' active-read ' : '') +
                                (disabled ? ' disabled ' : '')}
                            onClick={(e) => (!disabled ? tapeContext.setCurrentTapeIndex(i) : null)}>
                                {showTransitionStates &&
                                    sourceStates &&
                                    <span className="tape-row-states">
                                        {sourceStates.map(sourceState => 
                                        {
                                            return (
                                                <label key={sourceState.getGraphElementID()}>
                                                    {sourceState.getNodeLabel()}
                                                </label>
                                            );
                                        })}
                                    </span>}
                                <label className="tape-row-symbol">
                                    {e}
                                </label>
                            </div>
                        );
                    })}

                    {TAPE_INFINITE_RIGHT && tapeContext.isTapeRightInfinite() &&
                        <div className="tape-row-entry infinite">
                            <span className="tape-row-states"></span>
                            <label className="tape-row-symbol">{'...'}</label>
                        </div>}
                </div>
            </div>
        );
    }
}

export default TapeWidget;
