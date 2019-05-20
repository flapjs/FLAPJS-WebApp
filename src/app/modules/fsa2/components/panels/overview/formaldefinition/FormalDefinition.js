import React from 'react';
import './FormalDefinition.css';

import { EMPTY_CHAR } from 'modules/fsa2/graph/element/FSAEdge.js';

const EMPTY_SET = '\u2205';
const EQUAL = '=';
const DELTA = '\u03b4';

class FormalDefinition extends React.Component 
{
    constructor(props) 
    {
        super(props);
    }

    render() 
    {
        const machineController = this.props.machineController;
        const machine = machineController.getMachineBuilder().getMachine();
        const states = machineController.getStates();
        const finalStates = machineController.getFinalStates();
        const alphabet = machineController.getAlphabet().sort();
        let isNFA = machineController.getMachineType() == 'NFA';
        return <div className="formaldef-container">
            <h2>{'M = (Q, \u03A3, \u03b4, q0, F)'}</h2>
            <div>
                <h3>Q =</h3>
                <span className="formaldef-values">
                    {states.length > 0 ? '{ ' + states.join(', ') + ' }' : EMPTY_SET}
                </span>
            </div>
            <div>
                <h3>&Sigma; =</h3>
                <span className="formaldef-values">
                    {alphabet.length > 0 ? '{ ' + alphabet.join(', ') + ' }' : EMPTY_SET}
                </span>
            </div>
            <div>
                <h3>{DELTA}</h3>
                <div className="formaldef-values">
                    {
                        states.map((state, i) => 
                        {
                            let emptrans = machine.doTransition(state, EMPTY_CHAR);
                            let empclassName = '';

                            let transitions = alphabet.map((symbol, j) => 
                            {
                                let className = '';
                                let trans = machine.doTransition(state, symbol);
                                if (isNFA && !trans.length) return;
                                if (!isNFA && !trans.length) 
                                {
                                    className = 'error';
                                    trans = '-';
                                }
                                if (!isNFA && trans.length > 1) 
                                {
                                    className = 'error';
                                    trans = '{ ' + trans + ' }';
                                }
                                trans = isNFA ? '{ ' + trans + ' }' : '' + trans;
                                return <div key={'' + state + symbol} className={className}>
                                    {DELTA + '( ( ' + state + ', ' + symbol + ' ) )' + ' ' + EQUAL + ' ' + trans}
                                </div>;
                            });

                            if (emptrans.length > 0) 
                            {
                                if (!isNFA) 
                                {
                                    empclassName = 'error';
                                }
                                const addBrac = isNFA || emptrans.length > 1;
                                emptrans = addBrac ? '{ ' + emptrans + ' }' : '' + emptrans;
                                transitions.unshift(
                                    <div key={'' + state + EMPTY_CHAR} className={empclassName}>
                                        {DELTA + '( ( ' + state + ', ' + EMPTY_CHAR + ' ) )' + ' ' + EQUAL + ' ' + emptrans}
                                    </div>
                                );
                            }
                            return transitions;
                        })
                    }
                    {
                        isNFA && <div id="formaldef-otherinputs">
                            <div>{'For all other inputs (q, x),'}</div>
                            <div>{DELTA + '( (q, x) )' + ' ' + EQUAL + ' ' + EMPTY_SET}</div>
                        </div>
                    }
                </div>
            </div>
            <div>
                <h3>q0 =</h3>
                <span className="formaldef-values">
                    {states[0]}
                </span>
            </div>
            <div>
                <h3>F =</h3>
                <span className="formaldef-values">
                    {finalStates.length > 0 ? '{ ' + finalStates.join(',') + ' }' : EMPTY_SET}
                </span>
            </div>
        </div>;
    }
}

export default FormalDefinition;
