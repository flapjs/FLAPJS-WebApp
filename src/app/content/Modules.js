const Modules = {};

Modules['default'] = {
  name: "Default",
  version: "1.0.0",
  fetch: function(callback) { import(/* webpackChunkName: "module_default" */ 'modules/default/DefaultModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['fsa'] = {
  name: "Finite State Automata",
  version: "1.0.0",
  fetch: function(callback) { import(/* webpackChunkName: "module_fsa" */ 'modules/fsa/FSAModule.js').then(({ default: _ }) => callback( _ )); }
};

Modules['hlsm'] = {
  name: "High Level State Machine",
  version: "1.0.0",
  fetch: function(callback) { import(/* webpackChunkName: "module_hlsm" */ 'modules/hlsm/HLSMModule.js').then(({ default: _ }) => callback( _ )); }
};

export default Modules;
