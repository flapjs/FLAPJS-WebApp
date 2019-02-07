const Modules = {};

Modules['default'] = {
  name: "Default",
  version: "1.0.0",
  experimental: true,
  fetch: function(callback) { import(/* webpackChunkName: "module_default" */ 'modules/default/DefaultModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['fsa'] = {
  name: "Finite State Automata",
  version: "1.0.0",
  fetch: function(callback) { import(/* webpackChunkName: "module_fsa" */ 'modules/fsa/FSAModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['fsa2'] = {
  name: "Finite State Automata",
  version: "2.0.0",
  experimental: true,
  fetch: function(callback) { import(/* webpackChunkName: "module_fsa2" */ 'modules/fsa2/FSAModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['pda'] = {
  name: "Pushdown Automata",
  version: "1.0.0",
  experimental: true,
  fetch: function(callback) { import(/* webpackChunkName: "module_pda" */ 'modules/pda/PDAModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['tm'] = {
  name: "Turing Machine",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['dfs'] = {
  name: "Depth-First Search",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['hlsm'] = {
  name: "High Level State Machine",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['rbt'] = {
  name: "Red-Black Tree",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['mealy'] = {
  name: "Mealy Machine",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

Modules['moore'] = {
  name: "Moore Machine",
  version: "1.0.0",
  fetch: function(callback) { throw new Error("Module not yet implemented. Sorry :("); }
};

export default Modules;
