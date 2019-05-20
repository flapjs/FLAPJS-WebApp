const Modules = {};

Modules['fsa'] = {
    name: 'Finite Automata',
    version: '3.0.0',
    experimental: true,
    fetch: function (callback) { import(/* webpackChunkName: "module_fsa" */ 'modules/fsa2/FSAModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['pda'] = {
    name: 'Pushdown Automata',
    version: '1.0.0',
    experimental: true,
    fetch: function (callback) { import(/* webpackChunkName: "module_pda" */ 'modules/pda/PDAModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['re'] = {
    name: 'Regular Expression',
    version: '1.0.0',
    experimental: true,
    fetch: function (callback) { import(/* webpackChunkName: "module_re" */ 'modules/re/REModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['tm'] = {
    name: 'Turing Machine',
    version: '1.0.0',
    disabled: true,
    fetch: function (callback) { throw new Error('Module not yet implemented. Sorry :('); }
};

Modules['node'] = {
    name: 'Node Graph',
    version: '1.0.0',
    experimental: true,
    fetch: function (callback) { import(/* webpackChunkName: "module_nodegraph" */ 'modules/nodegraph/NodeGraphModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['tree'] = {
    name: 'Tree',
    version: '1.0.0',
    disabled: true,
    fetch: function (callback) { throw new Error('Module not yet implemented. Sorry :('); }
};

Modules['hlsm'] = {
    name: 'High Level State Machine',
    version: '1.0.0',
    disabled: true,
    fetch: function (callback) { throw new Error('Module not yet implemented. Sorry :('); }
};

Modules['mealy'] = {
    name: 'Mealy Machine',
    version: '1.0.0',
    disabled: true,
    fetch: function (callback) { throw new Error('Module not yet implemented. Sorry :('); }
};

Modules['moore'] = {
    name: 'Moore Machine',
    version: '1.0.0',
    disabled: true,
    fetch: function (callback) { throw new Error('Module not yet implemented. Sorry :('); }
};

export default Modules;
