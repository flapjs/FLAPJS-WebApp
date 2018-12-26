const Modules = {};

Modules['fsa'] = {
  name: "Finite State Automata",
  version: "1.0.0",
  fetch: function(callback) { import(/* webpackChunkName: "module_fsa" */ 'modules/fsa/FSAModule.js').then(({ default: _ }) => { callback( _ ); });}
};

export default Modules;
