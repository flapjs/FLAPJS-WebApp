export const base = {
    name: 'Default',
    version: '1.0.0',
    disabled: true,
    fetch: () => import(/* webpackChunkName: "module_base" */ './modules/base/BaseModule.js')
};

export const node = {
    name: 'Node Graph',
    version: '1.0.0',
    fetch: () => import(/* webpackChunkName: "module_node" */ './modules/node/NodeGraphModule.js')
};

export const fa = {
    name: 'Finite Automata',
    version: '3.0.0',
    fetch: () => import(/* webpackChunkName: "module_fa" */ './modules/fa/FiniteAutomataModule.js')
};

export const re = {
    name: 'Regular Expression',
    version: '1.0.0',
    fetch: () => import(/* webpackChunkName: "module_re" */ './modules/re/RegularExpressionModule.js')
};

export const pda = {
    name: 'Pushdown Automata',
    version: '1.0.0',
    fetch: () => import(/* webpackChunkName: "module_pda" */ './modules/pda/PushdownAutomataModule.js')
};

export const cfg = {
    name: 'Context-Free Grammar',
    version: '1.0.0',
    fetch: () => import(/* webpackChunkName: "module_re" */ './modules/re/RegularExpressionModule.js')
};

export const tm = {
    name: 'Turing Machine',
    version: '1.0.0',
    disabled: true,
    fetch: () => import(/* webpackChunkName: "module_tm" */ './modules/tm/TuringMachineModule.js')
};

export const logic = {
    name: 'Logic Circuit',
    version: '1.0.0',
    disabled: true,
    fetch: () => import(/* webpackChunkName: "module_logic" */ './modules/logic/LogicModule.js')
};
