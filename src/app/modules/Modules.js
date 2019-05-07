const Modules = {};

Modules['empty'] = {
  name: "Empty",
  version: "1.0.0",
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_empty" */ 'modules/empty/EmptyModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['nodalgraph'] = {
  name: 'Nodal Graph',
  version: '1.0.0',
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_nodalgraph" */ 'modules/nodalgraph/NodalGraphModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['nodegraph'] = {
  name: 'Node Graph',
  version: '1.0.0',
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_nodegraph" */ 'modules/nodegraph/NodeGraphModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['fsa'] = {
  name: "Finite Automata",
  version: "1.0.0",
  fetch: function (callback) { import(/* webpackChunkName: "module_fsa" */ 'modules/fsa/FSAModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['fsa2'] = {
  name: "Finite Automata",
  version: "2.0.0",
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_fsa2" */ 'modules/fsa2/FSAModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['pda'] = {
  name: "Pushdown Automata",
  version: "1.0.0",
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_pda" */ 'modules/pda/PDAModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['re'] = {
  name: "Regular Expression",
  version: "1.0.0",
  experimental: true,
  fetch: function (callback) { import(/* webpackChunkName: "module_re" */ 'modules/re/REModule.js').then(({ default: _ }) => callback(_)); }
};

Modules['tm'] = {
  name: "Turing Machine",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['dfs'] = {
  name: "Depth-First Search",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['hlsm'] = {
  name: "High Level State Machine",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['rbt'] = {
  name: "Red-Black Tree",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['mealy'] = {
  name: "Mealy Machine",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['moore'] = {
  name: "Moore Machine",
  version: "1.0.0",
  disabled: true,
  fetch: function (callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

export default Modules;
