/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/debug/Tester.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/debug/Tester.js":
/*!*****************************!*\
  !*** ./src/debug/Tester.js ***!
  \*****************************/
/*! exports provided: out, assertNotNull, assertEquals, assert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"out\", function() { return out; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assertNotNull\", function() { return assertNotNull; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assertEquals\", function() { return assertEquals; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assert\", function() { return assert; });\nconst TEST_DIR = './src/debug/test/';\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\n//For unit testing...\nlet testBuffer = [];\nlet testSuccesses = 0;\nlet testFailures = 0;\n\n//Start of program\n\nconsole.error(\"Preparing tests...\");\nconst files = fs.readdirSync(TEST_DIR);\nconsole.error(\"Starting \" + files.length + \" test(s)...\");\nconsole.error(\"- - - - - - - - - - - - - - - - - -\\n\");\nconst length = files.length;\nfor(let i = 0; i < length; ++i)\n{\n  const file = files[i];\n  let success = true;\n  console.error(\"== TEST #\" + i + \" == (\" + file + \")\");\n  {\n    try\n    {\n      testBuffer.length = 0;\n      testSuccesses = 0;\n      testFailures = 0;\n      __webpack_require__(\"./src/debug/test sync recursive ^\\\\.\\\\/.*$\")(\"./\" + file);\n      success = testFailures == 0;\n\n      if (!success)\n      {\n        while(testBuffer.length > 0)\n        {\n          const msg = testBuffer.shift();\n          console.error(msg);\n        }\n      }\n\n      ++testSuccesses;\n    }\n    catch(e)\n    {\n      console.error(e);\n      success = false;\n      ++testFailures;\n    }\n  }\n  const totals = \"(\" + testSuccesses + \"/\" + (testSuccesses + testFailures) + \")\";\n  console.error(\"== > \" + (success ? \"SUCCESS!\" : \"FAILURE!\") + \" \" + totals + \"\\n\");\n}\n\nconsole.error(\"- - - - - - - - - - - - - - - - - -\\n\");\n\n//End of program\n\nfunction out(msg)\n{\n  testBuffer.push(msg);\n}\n\nfunction assertNotNull(value, msg=null)\n{\n  if (!value)\n  {\n    ++testFailures;\n    testBuffer.push(\"= Failed: Value is null\" + (msg ? \" - \" + msg : \".\"));\n  }\n  else\n  {\n    ++testSuccesses;\n    testBuffer.push(\"= Passed!\");\n  }\n}\n\nfunction assertEquals(expected, value, msg=null)\n{\n  if (expected != value)\n  {\n    ++testFailures;\n    testBuffer.push(\"= Failed: Expected \\'\" + expected + \", but found \\'\" + value + \"\\'\" + (msg ? \" - \" + msg : \".\"));\n  }\n  else\n  {\n    ++testSuccesses;\n    testBuffer.push(\"= Passed!\");\n  }\n}\n\nfunction assert(condition, msg=null)\n{\n  if (!condition)\n  {\n    ++testFailures;\n    testBuffer.push(\"= Failed\" + (msg ? \" - \" + msg : \".\"));\n  }\n  else\n  {\n    ++testSuccesses;\n    testBuffer.push(\"= Passed!\");\n  }\n}\n\n\n//# sourceURL=webpack:///./src/debug/Tester.js?");

/***/ }),

/***/ "./src/debug/test sync recursive ^\\.\\/.*$":
/*!**************************************!*\
  !*** ./src/debug/test sync ^\.\/.*$ ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./TestConvertToDFA\": \"./src/debug/test/TestConvertToDFA.mjs\",\n\t\"./TestConvertToDFA.mjs\": \"./src/debug/test/TestConvertToDFA.mjs\",\n\t\"./TestIsEquivalentDFA\": \"./src/debug/test/TestIsEquivalentDFA.mjs\",\n\t\"./TestIsEquivalentDFA.mjs\": \"./src/debug/test/TestIsEquivalentDFA.mjs\",\n\t\"./TestSolveDFA\": \"./src/debug/test/TestSolveDFA.mjs\",\n\t\"./TestSolveDFA.mjs\": \"./src/debug/test/TestSolveDFA.mjs\",\n\t\"./TestSolveNFA\": \"./src/debug/test/TestSolveNFA.mjs\",\n\t\"./TestSolveNFA.mjs\": \"./src/debug/test/TestSolveNFA.mjs\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tvar id = map[req];\n\tif(!(id + 1)) { // check for number or string\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn id;\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/debug/test sync recursive ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack:///./src/debug/test_sync_^\\.\\/.*$?");

/***/ }),

/***/ "./src/debug/test/TestConvertToDFA.mjs":
/*!*********************************************!*\
  !*** ./src/debug/test/TestConvertToDFA.mjs ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tester.js */ \"./src/debug/Tester.js\");\n/* harmony import */ var machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/DFA.js */ \"./src/machine/DFA.js\");\n/* harmony import */ var machine_NFA_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! machine/NFA.js */ \"./src/machine/NFA.js\");\n/* harmony import */ var machine_Symbols_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! machine/Symbols.js */ \"./src/machine/Symbols.js\");\n/* harmony import */ var machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! machine/util/solveDFA.js */ \"./src/machine/util/solveDFA.js\");\n/* harmony import */ var machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! machine/util/convertNFA.js */ \"./src/machine/util/convertNFA.js\");\n\n\n\n\n\n\n\n\nlet nfa = new machine_NFA_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\nlet result = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__[\"convertToDFA\"])(nfa);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result && result.validate(), \"Empty machine is valid DFA.\");\n\n//Try simplest machine\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Trying single state machine...\");\nlet state0 = nfa.newState(\"q0\");\nnfa.newTransition(state0, state0, \"0\");\nnfa.newTransition(state0, state0, \"1\");\nresult = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__[\"convertToDFA\"])(nfa);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result && result.validate());\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for states...\");\nlet states = result.getStates();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"States: \" + states);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](1, states.length);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result.hasState(\"{\" + state0 + \"}\"));\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for alphabet...\");\nlet alphabet = result.getAlphabet();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Alphabet: \" + alphabet);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](2, alphabet.length);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](alphabet.includes(\"0\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](alphabet.includes(\"1\"));\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for transitions...\");\nlet transitions = result.getTransitions();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Transitions: \" + transitions);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](\"{\" + state0 + \"}\", result.doTransition(\"{\" + state0 + \"}\", \"0\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](\"{\" + state0 + \"}\", result.doTransition(\"{\" + state0 + \"}\", \"1\"));\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Trying another machine...\");\nlet state1 = nfa.newState(\"q1\");\nnfa.newTransition(state0, state1, \"1\");\nnfa.setFinalState(state1);\nresult = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__[\"convertToDFA\"])(nfa);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result && result.validate());\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for states...\");\nstates = result.getStates();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"States: \" + states);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"StartState: \" + result.getStartState());\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"FinalStates: \" + result.getFinalStates());\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for alphabet...\");\nalphabet = result.getAlphabet();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Alphabet: \" + alphabet);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for transitions...\");\ntransitions = result.getTransitions();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Transitions: \" + transitions);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing by solving inputs...\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](!Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"0\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](!Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"1\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"111111111111\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"10000000001\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"0000000001\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"101010010010100101\"));\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing immediate moves...\");\nnfa.newTransition(state0, state1, machine_Symbols_js__WEBPACK_IMPORTED_MODULE_3__[\"EMPTY\"]);\nresult = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__[\"convertToDFA\"])(nfa);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result && result.validate());\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for states...\");\nstates = result.getStates();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"States: \" + states);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"StartState: \" + result.getStartState());\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"FinalStates: \" + result.getFinalStates());\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for alphabet...\");\nalphabet = result.getAlphabet();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Alphabet: \" + alphabet);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Checking for transitions...\");\ntransitions = result.getTransitions();\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Transitions: \" + transitions);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing by solving inputs...\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"0\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"1\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"111111111111\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"10000000001\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"0000000001\"));\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_4__[\"solveDFA\"])(result, \"101010010010100101\"));\n\n\n/**NEW TEST*/\n{\n  let machine = new machine_NFA_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\n  machine.newState(\"q0\");\n  machine.newState(\"q1\");\n  machine.newTransition(\"q0\", \"q1\", \"1\");\n  machine.setStartState(\"q0\");\n  machine.setFinalState(\"q0\");\n  let result = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_5__[\"convertToDFA\"])(machine);\n  _Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](result.validate());\n}\n\n\n//# sourceURL=webpack:///./src/debug/test/TestConvertToDFA.mjs?");

/***/ }),

/***/ "./src/debug/test/TestIsEquivalentDFA.mjs":
/*!************************************************!*\
  !*** ./src/debug/test/TestIsEquivalentDFA.mjs ***!
  \************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tester.js */ \"./src/debug/Tester.js\");\n/* harmony import */ var machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/DFA.js */ \"./src/machine/DFA.js\");\n/* harmony import */ var machine_Symbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! machine/Symbols.js */ \"./src/machine/Symbols.js\");\n/* harmony import */ var machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! machine/util/equalFSA.js */ \"./src/machine/util/equalFSA.js\");\n\n\n\n\n\n\n\nlet dfa1 = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nlet dfa2 = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](true, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"Empty machines.\");\n\n//= accepts all strings\n//Make first machine\ndfa1.newState(\"q0\");\ndfa1.setFinalState(\"q0\");\n\n//Make second machine\ndfa2.newState(\"q0\");\ndfa2.setFinalState(\"q0\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](true, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"Universal machines.\");\n\ndfa2.setFinalState(\"q0\", false);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](false, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"Universal vs none machines.\");\n\n//= (aa)*\n//Make first machine\ndfa1.setFinalState(\"q0\", false);\ndfa1.newState(\"q1\");\ndfa1.newTransition(\"q0\", \"q1\", \"a\");\ndfa1.newTransition(\"q1\", \"q0\", \"a\");\ndfa1.setFinalState(\"q1\");\n\n//= (aa)*\n//Make second machine\ndfa2.newState(\"q1\");\ndfa2.newState(\"q2\");\ndfa2.newState(\"q3\");\ndfa2.newTransition(\"q0\", \"q1\", \"a\");\ndfa2.newTransition(\"q1\", \"q2\", \"a\");\ndfa2.newTransition(\"q2\", \"q3\", \"a\");\ndfa2.newTransition(\"q3\", \"q0\", \"a\");\ndfa2.setFinalState(\"q1\");\ndfa2.setFinalState(\"q3\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](true, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"(aa)* machines.\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](true, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentFSA\"])(dfa1, dfa2), \"(aa)* machines.\");\n\ndfa2.setFinalState(\"q0\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](false, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"(a)* vs (aa)* machines.\");\n\ndfa1 = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\ndfa2 = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n\ndfa1.newState(\"q0\");\ndfa1.newState(\"q1\");\ndfa1.newTransition(\"q0\", \"q1\", \"1\");\ndfa1.newTransition(\"q1\", \"q0\", \"1\");\ndfa1.setFinalState(\"q1\");\n\ndfa2.newState(\"q0\");\ndfa2.newState(\"q1\");\ndfa2.newTransition(\"q0\", \"q1\", \"a\");\ndfa2.newTransition(\"q1\", \"q0\", \"a\");\ndfa2.setFinalState(\"q1\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](false, Object(machine_util_equalFSA_js__WEBPACK_IMPORTED_MODULE_3__[\"isEquivalentDFA\"])(dfa1, dfa2), \"a vs 1 machines.\");\n\n\n//# sourceURL=webpack:///./src/debug/test/TestIsEquivalentDFA.mjs?");

/***/ }),

/***/ "./src/debug/test/TestSolveDFA.mjs":
/*!*****************************************!*\
  !*** ./src/debug/test/TestSolveDFA.mjs ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tester.js */ \"./src/debug/Tester.js\");\n/* harmony import */ var machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/DFA.js */ \"./src/machine/DFA.js\");\n/* harmony import */ var machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! machine/util/solveDFA.js */ \"./src/machine/util/solveDFA.js\");\n\n\n\n\n\n//Regex: 1*\nlet machine = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nlet state0 = machine.newState(\"q0\");\nlet state1 = machine.newState(\"q1\");\nmachine.newTransition(state0, state1, \"0\");\nmachine.newTransition(state0, state0, \"1\");\nmachine.newTransition(state1, state1, \"0\");\nmachine.newTransition(state1, state1, \"1\");\nmachine.setStartState(state0);\nmachine.setFinalState(state0);\n\n//Make sure the DFA is a valid DFA\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assert\"](machine.validate(), \"Machine is valid.\");\n\n//Should accept the empty string since start state is final state\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"\"), true, \"Machine accepts the empty string.\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing other input strings...\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"0\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"1\"), true);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"011111\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"11010101\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveDFA_js__WEBPACK_IMPORTED_MODULE_2__[\"solveDFA\"])(machine, \"1111\"), true);\n\n\n//# sourceURL=webpack:///./src/debug/test/TestSolveDFA.mjs?");

/***/ }),

/***/ "./src/debug/test/TestSolveNFA.mjs":
/*!*****************************************!*\
  !*** ./src/debug/test/TestSolveNFA.mjs ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tester_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tester.js */ \"./src/debug/Tester.js\");\n/* harmony import */ var machine_NFA_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/NFA.js */ \"./src/machine/NFA.js\");\n/* harmony import */ var machine_Symbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! machine/Symbols.js */ \"./src/machine/Symbols.js\");\n/* harmony import */ var machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! machine/util/solveNFA.js */ \"./src/machine/util/solveNFA.js\");\n\n\n\n\n\n\n//Regex: 1*\nlet machine = new machine_NFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nlet state0 = machine.newState(\"q0\");\nlet state1 = machine.newState(\"q1\");\nmachine.newTransition(state0, state1, \"0\");\nmachine.newTransition(state0, state0, \"1\");\nmachine.newTransition(state1, state1, \"0\");\nmachine.newTransition(state1, state1, \"1\");\nmachine.setStartState(state0);\nmachine.setFinalState(state0);\n\n//Should accept the empty string since start state is final state\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"\"), true, \"Machine accepts the empty string.\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing DFA-like NFA machine...\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"0\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"1\"), true);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"011111\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"11010101\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"1111\"), true);\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing NFA with immediate transitions...\");\nmachine = new machine_NFA_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nstate0 = machine.newState(\"q0\");\nstate1 = machine.newState(\"q1\");\nlet state2 = machine.newState(\"q2\");\nmachine.newTransition(state0, state1, \"0\");\nmachine.newTransition(state0, state2, \"1\");\nmachine.newTransition(state1, state2, machine_Symbols_js__WEBPACK_IMPORTED_MODULE_2__[\"EMPTY\"]);\nmachine.newTransition(state1, state0, machine_Symbols_js__WEBPACK_IMPORTED_MODULE_2__[\"EMPTY\"]);\nmachine.newTransition(state1, state1, \"0\");\nmachine.newTransition(state1, state1, \"1\");\nmachine.setStartState(state0);\nmachine.setFinalState(state2);\n\n//Should accept the empty string since start state is final state\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"\"), false, \"Machine rejects the empty string.\");\n\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"out\"](\"Testing other input strings...\");\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"0\"), true);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"1\"), true);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"011111\"), true);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"11010101\"), false);\n_Tester_js__WEBPACK_IMPORTED_MODULE_0__[\"assertEquals\"](Object(machine_util_solveNFA_js__WEBPACK_IMPORTED_MODULE_3__[\"solveNFA\"])(machine, \"1111\"), false);\n\n\n//# sourceURL=webpack:///./src/debug/test/TestSolveNFA.mjs?");

/***/ }),

/***/ "./src/machine/DFA.js":
/*!****************************!*\
  !*** ./src/machine/DFA.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FSA_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FSA.js */ \"./src/machine/FSA.js\");\n\n\nconst SRC = 0;\nconst SYMBOL = 1;\nconst DST = 2;\n\nclass DFA extends _FSA_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n{\n  constructor()\n  {\n    super();\n  }\n\n  validate()\n  {\n    const alphabet = this.getAlphabet();\n    const foundSymbols = new Array(alphabet.length);\n    foundSymbols.fill(false);\n\n    for(const state of this._states)\n    {\n      //Get all outgoing transitions\n      const transitions = this.getOutgoingTransitions(state);\n      for(const transition of transitions)\n      {\n        const index = alphabet.indexOf(transition[1]);\n        if (foundSymbols[index] == false)\n        {\n          foundSymbols[index] = true;\n        }\n        else\n        {\n          //Found duplicate\n          return false;\n        }\n      }\n\n      //Reset foundSymbols for next state\n      const length = foundSymbols.length;\n      for(let i = 0; i < length; ++i)\n      {\n        if (foundSymbols[i] == false)\n        {\n          //Found missing symbol for state\n          return false;\n        }\n        foundSymbols[i] = false;\n      }\n    }\n\n    return true;\n  }\n\n  //Override default behavior\n  newTransition(fromState, toState, symbol)\n  {\n    if (!this._states.includes(fromState))\n    {\n      throw new Error(\"State \\'\" + fromState + \"\\' does not exist.\");\n    }\n\n    if (!this._states.includes(toState))\n    {\n      throw new Error(\"State \\'\" + toState + \"\\' does not exist.\");\n    }\n\n    for(const transition of this._transitions)\n    {\n      //Check if already exists...\n      if (transition[SRC] == fromState && transition[SYMBOL] == symbol && transition[DST] == toState)\n      {\n        return;\n      }\n      //Check if valid deterministic transition...\n      else if (transition[SRC] == fromState && transition[SYMBOL] == symbol)\n      {\n        throw new Error(\"Unable to create illegal nondeterministic transition for DFA.\");\n      }\n    }\n\n    //Create new transition\n    this._transitions.push([fromState, symbol, toState]);\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (DFA);\n\n\n//# sourceURL=webpack:///./src/machine/DFA.js?");

/***/ }),

/***/ "./src/machine/FSA.js":
/*!****************************!*\
  !*** ./src/machine/FSA.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst SRC = 0;\nconst SYMBOL = 1;\nconst DST = 2;\n\nclass FSA\n{\n  constructor()\n  {\n    this._states = [];\n    this._transitions = [];\n    this._finalStates = [];\n\n    this._customAlphabet = [];\n  }\n\n  newState(state)\n  {\n    if (this._states.includes(state))\n    {\n      throw new Error(\"State \\'\" + state + \"\\' already added to states.\");\n    }\n\n    this._states.push(state);\n    return state;\n  }\n\n  deleteState(state)\n  {\n    if (!this._states.includes(state))\n    {\n      throw new Error(\"State \\'\" + state + \"\\' does not exist.\");\n    }\n\n    this._states.splice(this._states.indexOf(state), 1);\n  }\n\n  newTransition(fromState, toState, symbol)\n  {\n    if (!this._states.includes(fromState))\n    {\n      throw new Error(\"State \\'\" + fromState + \"\\' does not exist.\");\n    }\n\n    if (!this._states.includes(toState))\n    {\n      throw new Error(\"State \\'\" + toState + \"\\' does not exist.\");\n    }\n\n    //Check if already exists...\n    for(const transition of this._transitions)\n    {\n      if (transition[SRC] == fromState && transition[SYMBOL] == symbol && transition[DST] == toState)\n      {\n        return;\n      }\n    }\n\n    //Create new transition\n    this._transitions.push([fromState, symbol, toState]);\n  }\n\n  deleteTransition(fromState, toState, symbol=null)\n  {\n    for(let i = this._transitions.length - 1; i >= 0; --i)\n    {\n      const transition = this._transitions[i];\n      if (transition[SRC] == fromState && transition[DST] == toState)\n      {\n        //Delete if src, dst, and symbols match... or if deleting all symbols\n        if (symbol == null || transition[SYMBOL] == symbol)\n        {\n          this._transitions.splice(i, 1);\n        }\n      }\n    }\n  }\n\n  newSymbol(symbol)\n  {\n    if (this._customAlphabet.includes(symbol))\n    {\n      throw new Error(\"Symbol \\'\" + symbol + \"\\' already added to alphabet.\");\n    }\n\n    this._customAlphabet.push(symbol);\n  }\n\n  deleteSymbol(symbol)\n  {\n    if (!this._customAlphabet.includes(symbol))\n    {\n      throw new Error(\"Unable to remove symbol \\'\" + symbol + \"\\'.\");\n    }\n\n    this._customAlphabet.splice(this._customAlphabet.indexOf(symbol), 1);\n  }\n\n  setStartState(state)\n  {\n    if (this._states.length <= 0)\n    {\n      throw new Error(\"Not enough states.\");\n    }\n\n    if (!this._states.includes(state))\n    {\n      throw new Error(\"State \\'\" + state + \"\\' does not exist.\");\n    }\n\n    if (this.getStartState() == state) return;\n\n    this._states.splice(this._states.indexOf(state), 1);\n    this._states.unshift(state);\n  }\n\n  setFinalState(state, isFinal=true)\n  {\n    if (!this._states.includes(state))\n    {\n      throw new Error(\"State \\'\" + state + \"\\' does not exist.\");\n    }\n\n    if (isFinal)\n    {\n      if (this._finalStates.includes(state)) return;\n\n      this._finalStates.push(state);\n    }\n    else\n    {\n      if (!this._finalStates.includes(state)) return;\n      this._finalStates.splice(this._finalStates.indexOf(state), 1);\n    }\n  }\n\n  doTransition(state, symbol)\n  {\n    for(const transition of this._transitions)\n    {\n      if (transition[SRC] == state && transition[SYMBOL] == symbol)\n      {\n        return transition[DST];\n      }\n    }\n    return null;\n  }\n\n  isFinalState(state)\n  {\n    return this._finalStates.includes(state);\n  }\n\n  hasState(state)\n  {\n    return this._states.includes(state);\n  }\n\n  getStates()\n  {\n    return this._states;\n  }\n\n  //Is the same as isAlphabet if the user did not add custom symbols\n  isUsedAlphabet(symbol)\n  {\n    for(const transition of this._transitions)\n    {\n      if (transition[SYMBOL] == symbol)\n      {\n        return true;\n      }\n    }\n    return false;\n  }\n\n  //Includes custom user-defined symbols (from newSymbol)\n  isAlphabet(symbol)\n  {\n    for(const s of this._customAlphabet)\n    {\n      if (s == symbol) return true;\n    }\n\n    return this.isUsedAlphabet(symbol);\n  }\n\n  getUsedAlphabet(dst=[])\n  {\n    const result = dst;\n    for(const transition of this._transitions)\n    {\n      const symbol = transition[SYMBOL];\n      if (!result.includes(symbol))\n      {\n        result.push(symbol);\n      }\n    }\n    return result;\n  }\n\n  getAlphabet(dst=[])\n  {\n    const result = dst;\n    for(const s of this._customAlphabet)\n    {\n      result.push(s);\n    }\n    return this.getUsedAlphabet(result);\n  }\n\n  getOutgoingTransitions(state=null, dst=[])\n  {\n    const result = dst;\n    for(const transition of this._transitions)\n    {\n      if (transition[SRC] == state)\n      result.push(transition);\n    }\n    return result;\n  }\n\n  getTransitions()\n  {\n    return this._transitions;\n  }\n\n  getStartState()\n  {\n    return this._states.length <= 0 ? null : this._states[0];\n  }\n\n  getFinalStates()\n  {\n    return this._finalStates;\n  }\n\n  toJSON()\n  {\n    const result = {};\n    result._version = \"1.0.0\";\n\n    if (this instanceof DFA) result.type = \"DFA\";\n    else if (this instanceof NFA) result.type = \"NFA\";\n    else result.type = \"FSA\";\n    result.states = this._states.slice();\n    result.alphabet = this._customAlphabet.slice();\n    result.usedAlphabet = this.getUsedAlphabet();\n    result.transitions = this._transitions.slice();\n    result.startState = this.getStartState();\n    result.finalStates = this._finalStates.slice();\n\n    return result;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (FSA);\n\n\n//# sourceURL=webpack:///./src/machine/FSA.js?");

/***/ }),

/***/ "./src/machine/NFA.js":
/*!****************************!*\
  !*** ./src/machine/NFA.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FSA_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FSA.js */ \"./src/machine/FSA.js\");\n/* harmony import */ var _Symbols_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Symbols.js */ \"./src/machine/Symbols.js\");\n\n\n\nconst SRC = 0;\nconst SYMBOL = 1;\nconst DST = 2;\n\nclass NFA extends _FSA_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n{\n  constructor()\n  {\n    super();\n  }\n\n  //Override\n  getAlphabet()\n  {\n    const result = [];\n    for(const transition of this._transitions)\n    {\n      const symbol = transition[SYMBOL];\n      if (!result.includes(symbol) && symbol != _Symbols_js__WEBPACK_IMPORTED_MODULE_1__[\"EMPTY\"])\n      {\n        result.push(symbol);\n      }\n    }\n    return result;\n  }\n\n  //Override\n  doTransition(state, symbol, dst=[])\n  {\n    const result = dst;\n    for(const transition of this._transitions)\n    {\n      if (transition[SRC] == state && transition[SYMBOL] == symbol)\n      {\n        result.push(transition[DST]);\n      }\n    }\n    return result;\n  }\n\n  doClosureTransition(state, dst=[])\n  {\n    const result = dst;\n    result.push(state);\n    for(let i = 0; i < result.length; ++i)\n    {\n      const transitions = this.getOutgoingTransitions(state);\n      for(const transition of transitions)\n      {\n        if (transition[SYMBOL] == _Symbols_js__WEBPACK_IMPORTED_MODULE_1__[\"EMPTY\"])\n        {\n          const dst = transition[DST];\n          if (!result.includes(dst))\n          {\n            result.push(dst);\n          }\n        }\n      }\n    }\n    return result;\n  }\n\n  doTerminalTransition(state, symbol, dst=[])\n  {\n    const result = dst;\n    for(const transition of this._transitions)\n    {\n      if (transition[SRC] == state && transition[SYMBOL] == symbol)\n      {\n        //Get closure on destination states\n        const states = this.doClosureTransition(transition[DST]);\n        for(const s of states)\n        {\n          if (!result.includes(s))\n          {\n            result.push(s);\n          }\n        }\n      }\n    }\n    return result;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (NFA);\n\n\n//# sourceURL=webpack:///./src/machine/NFA.js?");

/***/ }),

/***/ "./src/machine/Symbols.js":
/*!********************************!*\
  !*** ./src/machine/Symbols.js ***!
  \********************************/
/*! exports provided: EMPTY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EMPTY\", function() { return EMPTY; });\nconst EMPTY = '#';\n\n\n//# sourceURL=webpack:///./src/machine/Symbols.js?");

/***/ }),

/***/ "./src/machine/util/convertNFA.js":
/*!****************************************!*\
  !*** ./src/machine/util/convertNFA.js ***!
  \****************************************/
/*! exports provided: convertToDFA */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"convertToDFA\", function() { return convertToDFA; });\n/* harmony import */ var machine_DFA_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! machine/DFA.js */ \"./src/machine/DFA.js\");\n/* harmony import */ var machine_Symbols_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/Symbols.js */ \"./src/machine/Symbols.js\");\n\n\n\nfunction convertToDFA(nfa)\n{\n  const result = new machine_DFA_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n  const alphabet = nfa.getAlphabet();\n  const startState = nfa.getStartState();\n\n  //Make new DFA start state\n  let nextStates = nfa.doClosureTransition(startState);\n  const newStartState = newDFAStateFromNFA(result, nfa, nextStates);\n\n  //Start expansion with the start state\n  const states = [];\n  states.push(newStartState);\n\n  //While there are still more states to expand from...\n  while(states.length > 0)\n  {\n    const nextState = states.shift();\n    nextStates = expandNFAStateToDFA(nextState, nfa, result);\n\n    //Push all nextStates to end of states\n    for(const s of nextStates)\n    {\n      states.push(s);\n    }\n  }\n\n  //Check for the new alphabet...\n  const newAlphabet = result.getAlphabet();\n  for(const state of result.getStates())\n  {\n    for(const symbol of newAlphabet)\n    {\n      //If transition for this symbol does not exist...\n      if (!result.doTransition(state, symbol))\n      {\n        //Create it\n        result.newTransition(state, state, symbol);\n      }\n    }\n  }\n\n  return result;\n}\n\nfunction expandNFAStateToDFA(state, nfa, dfa)\n{\n  const result = [];\n  const alphabet = nfa.getAlphabet();\n\n  let terminals = [];\n  let nfaStates = null;\n  let dfaState = null;\n\n  for(const symbol of alphabet)\n  {\n    //Get all closed reachable states...\n    nfaStates = getSetFromState(state);\n    for(const s of nfaStates)\n    {\n      nfa.doTerminalTransition(s, symbol, terminals);\n    }\n\n    //If has reachable states...\n    if (terminals.length > 0)\n    {\n      dfaState = getStateFromSet(terminals);\n\n      //Create state if it does not exist...\n      if (!dfa.hasState(dfaState))\n      {\n        dfaState = newDFAStateFromNFA(dfa, nfa, terminals);\n        result.push(dfaState);\n      }\n\n      //Create transition for reachable state\n      dfa.newTransition(state, dfaState, symbol);\n    }\n\n    //Reset list\n    terminals.length = 0;\n  }\n\n  return result;\n}\n\nfunction newDFAStateFromNFA(dfa, nfa, nfaStates)\n{\n  const result = dfa.newState(getStateFromSet(nfaStates));\n\n  //If the NFA states contain a final, then DFA state should be final\n  for(const s of nfaStates)\n  {\n    if (nfa.isFinalState(s))\n    {\n      dfa.setFinalState(result);\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction getStateFromSet(nfaStates)\n{\n  nfaStates.sort();\n  return \"{\" + nfaStates.join(\",\") + \"}\";\n}\n\nfunction getSetFromState(dfaState)\n{\n  return dfaState.substring(1, dfaState.length - 1).split(\",\");\n}\n\n\n//# sourceURL=webpack:///./src/machine/util/convertNFA.js?");

/***/ }),

/***/ "./src/machine/util/equalFSA.js":
/*!**************************************!*\
  !*** ./src/machine/util/equalFSA.js ***!
  \**************************************/
/*! exports provided: isEquivalentFSA, isEquivalentDFA */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isEquivalentFSA\", function() { return isEquivalentFSA; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isEquivalentDFA\", function() { return isEquivalentDFA; });\n/* harmony import */ var machine_DFA_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! machine/DFA.js */ \"./src/machine/DFA.js\");\n/* harmony import */ var machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! machine/util/convertNFA.js */ \"./src/machine/util/convertNFA.js\");\n\n\n\nfunction isEquivalentFSA(fsa1, fsa2)\n{\n  if (!(fsa1 instanceof machine_DFA_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) || !fsa1.validate())\n  {\n    fsa1 = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_1__[\"convertToDFA\"])(fsa1);\n  }\n  if (!(fsa2 instanceof machine_DFA_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) || !fsa2.validate())\n  {\n    fsa2 = Object(machine_util_convertNFA_js__WEBPACK_IMPORTED_MODULE_1__[\"convertToDFA\"])(fsa2);\n  }\n  return isEquivalentDFA(fsa1, fsa2);\n}\n\nfunction isEquivalentDFA(dfa1, dfa2)\n{\n  const alphabet = union(dfa1.getAlphabet(), dfa2.getAlphabet());\n  let s1 = null;\n  let s2 = null;\n  let newSet = null;\n\n  //1. For every state q in Q1 U Q2, MakeSet(q)\n  const sets = new Map();\n  const stack = [];\n  // - For each state q_1 in Q1, make {q_1}\n  let flag1 = false;\n  for(const q of dfa1.getStates())\n  {\n    s1 = \"1_\" + q;\n    sets.set(s1, [s1]);\n    flag1 = true;\n  }\n  // - For each state q_2 in Q2, make {q_2}\n  let flag2 = false;\n  for(const q of dfa2.getStates())\n  {\n    s2 = \"2_\" + q;\n    sets.set(s2, [s2]);\n    flag2 = true;\n  }\n  // - If no states exists in both, they are equivalent\n  if (sets.size == 0) return true;\n  // - If no states exists in either, they are not equivalent\n  if (!flag1 || !flag2) return false;\n\n  //2. Union(s1, s2) and Push(s1, s2) to stack S\n  // - Union(q_1, q_2) to refer to the same set\n  s1 = \"1_\" + dfa1.getStartState();\n  s2 = \"2_\" + dfa2.getStartState();\n  newSet = union(sets.get(s1), sets.get(s2));\n  sets.set(s1, newSet);\n  sets.set(s2, newSet);\n  // - Push(q_1, q_2) to stack\n  stack.push([s1, s2]);\n\n  //3. While S is not empty:\n  while(stack.length > 0)\n  {\n    //  a. Pop pair(q1, q2) from S\n    let set1 = null;\n    let set2 = null;\n    let pair = stack.pop();\n    //  b. For each a of Alphabet\n    for(const a of alphabet)\n    {\n      //    i. r1 = Find(Transition(q1, a))\n      s1 = \"1_\" + dfa1.doTransition(pair[0].substring(2), a);\n      set1 = sets.get(s1);\n      //    ii. r2 = Find(Transition(q2, a))\n      s2 = \"2_\" + dfa2.doTransition(pair[1].substring(2), a);\n      set2 = sets.get(s2);\n\n      // - if either lead no where, it is not a valid pair to work with.\n      if (!set1 || !set2) return false;\n\n      //    iii. if r1 != r2\n      if (set1 != set2)\n      {\n        //      1. Union(r1, r2) and Push(r1, r2) to S\n        //        - Union(q_1, q_2) to refer to the same set\n        newSet = union(set1, set2);\n        sets.set(s1, newSet);\n        sets.set(s2, newSet);\n        // - Update all elements in set to refer to the same set\n        for(const key of set1)\n        {\n          sets.set(key, newSet);\n        }\n        // - Update all elements in set to refer to the same set\n        for(const key of set2)\n        {\n          sets.set(key, newSet);\n        }\n        //        - Push(q_1, q_2) to stack\n        stack.push([s1, s2]);\n      }\n    }\n  }\n  //4. if no set contains a final and a non-final state\n  for(const states of sets.values())\n  {\n    let isFinal = false;\n    let isNotFinal = false;\n    for(const state of states)\n    {\n      if (state.startsWith(\"1_\"))\n      {\n        // - Whether a state that belongs to the first machine is a final or not\n        if (dfa1.isFinalState(state.substring(2)))\n        {\n          isFinal = true;\n        }\n        else\n        {\n          isNotFinal = true;\n        }\n      }\n      else if (state.startsWith(\"2_\"))\n      {\n        // - Whether a state that belongs to the second machine is a final or not\n        if (dfa2.isFinalState(state.substring(2)))\n        {\n          isFinal = true;\n        }\n        else\n        {\n          isNotFinal = true;\n        }\n      }\n      else\n      {\n        throw new Error(\"Found state from unknown machine.\");\n      }\n    }\n\n    // - If this set contains BOTH a final and non-final state, then it is not equal\n    if (isFinal && isNotFinal)\n    {\n      return false;\n    }\n  }\n  return true;\n}\n\nfunction union(set1, set2)\n{\n  const result = [];\n  for(const e of set1)\n  {\n    result.push(e);\n  }\n  for(const e of set2)\n  {\n    if (!set1.includes(e))\n    {\n      result.push(e);\n    }\n  }\n  return result;\n}\n\n\n//# sourceURL=webpack:///./src/machine/util/equalFSA.js?");

/***/ }),

/***/ "./src/machine/util/solveDFA.js":
/*!**************************************!*\
  !*** ./src/machine/util/solveDFA.js ***!
  \**************************************/
/*! exports provided: solveDFA */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solveDFA\", function() { return solveDFA; });\nfunction solveDFA(dfa, input)\n{\n  if (typeof input == 'string') input = input[Symbol.iterator]();\n  \n  let state = dfa.getStartState();\n  let symbol = null;\n  while((symbol = input.next().value) != null)\n  {\n    state = dfa.doTransition(state, symbol);\n  }\n  return dfa.isFinalState(state);\n};\n\n\n//# sourceURL=webpack:///./src/machine/util/solveDFA.js?");

/***/ }),

/***/ "./src/machine/util/solveNFA.js":
/*!**************************************!*\
  !*** ./src/machine/util/solveNFA.js ***!
  \**************************************/
/*! exports provided: solveNFA */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solveNFA\", function() { return solveNFA; });\n/* harmony import */ var machine_Symbols_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! machine/Symbols.js */ \"./src/machine/Symbols.js\");\n\n\nfunction solveNFA(nfa, input)\n{\n  if (typeof input === 'string') input = input[Symbol.iterator]();\n\n  let cachedStates = [];\n  let cachedSymbols = [];\n  cachedStates.push({state: nfa.getStartState(), index: 0});\n  let checkedStates = [];\n\n  let state = null;\n  let symbol = null;\n  let nextStates = [];\n  let nextIndex = 0;\n  while(cachedStates.length > 0)\n  {\n    symbol = input.next().value;\n    if (symbol != null)\n    {\n      cachedSymbols.push(symbol);\n    }\n\n    for(let cstate of cachedStates)\n    {\n      state = cstate.state;\n      symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;\n\n      if (symbol != null)\n      {\n        //Read to next state...\n        nextIndex = cstate.index + 1;\n        for(let nextState of nfa.doTransition(state, symbol))\n        {\n          nextStates.push({state: nextState, index: nextIndex});\n        }\n      }\n      else\n      {\n        if (nfa.isFinalState(state)) return true;\n        checkedStates.push(state);\n      }\n\n      //Read none to next state...\n      nextIndex = cstate.index;\n      for(let nextState of nfa.doTransition(state, machine_Symbols_js__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY\"]))\n      {\n        if (checkedStates.includes(nextState)) continue;\n        if (symbol == null && nfa.isFinalState(nextState)) return true;\n\n        nextStates.push({state: nextState, index: nextIndex});\n      }\n    }\n    cachedStates.length = 0;\n    cachedStates.push(...nextStates);\n    nextStates.length = 0;\n  }\n\n  return false;\n};\n\n\n//# sourceURL=webpack:///./src/machine/util/solveNFA.js?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ })

/******/ });