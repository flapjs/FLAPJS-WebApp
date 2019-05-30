# Flap.js
*Formal Languages and Automata Package*

[![Build Status](https://travis-ci.org/flapjs/FLAPJS-WebApp.svg?branch=master)](https://travis-ci.org/flapjs/FLAPJS-WebApp)

> By the students. For the students.

ANNOUNCEMENT: We are always looking for interested contributors and new members for the team! If you have any interest in web development, UI/UX design, computation theory, or general graphing systems, please contact us. We encourage you to play around with our repo and try out its features! (For more info, go to the bottom of this page.)

---

## Purpose
To make a program that is more accessible and intuitive to use, so we can all become a [JFLAP](http://www.jflap.org/)-free homework group for Professor Minnes’s class (CSE 105).

## Table of Contents
* [Features](#features)
* [Getting Started](#setting-up-the-workspace)
* [Running the Program](#running-the-program)
* [Testing the Machine Functions](#testing-the-machine-functions)
* [Project Structure](#project-structure)
  * [Entry Point](#entry-point)
  * [Pages](#pages)
  * [App Page](#app-page)
  * [Graph Pipeline](#graph-pipeline)
    * [NodeGraph](#nodegraph)
    * [Machines](#machines)
    * [GraphRenderer](#graphrenderer)
  * [InputController](#inputcontroller)
  * [Auto-Saving](#auto-saving)
  * [Event History](#event-history)
  * [Eventable](#eventable)
  * [NotificationSystem](#notificationsystem)

---

## Compatibility
- [x] Windows
- [x] Mac
- [x] Android
- [x] iOS
- [ ] All major browsers
  - [x] Chrome
  - [x] Firefox
  - [ ] Edge
  - [x] Safari
  - [ ] Opera

(It may work on other unchecked platforms, though it is completely tested)

## Features

### 1.0.0 (Future)
- [ ] Set construction scripting language
- [ ] Turing Machine
- [ ] Formal Definition summary
  - [ ] Tape Symbols
  - [ ] q_acc
  - [ ] q_rej
- [ ] Tape testing
  - [ ] TM

### 0.4.1
- [x] Theme presets
- [ ] Context-Free Grammars
- [ ] StepTracer design
- [ ] Cross-window operations
- [x] Automatic build pipeline with TravisCI

### 0.3.4
- [x] Pushdown Automata
- [x] Regular Expressions
- [x] Hotkey system
- [x] New UI design

### 0.2.0
- [x] Module system
- [x] Graph optimizations
- [x] Bug reporting
- [x] Generic nodal graphing mode

### 0.1.0
- [x] Deterministic Finite Automata
- [x] Nondeterministic Finite Automata
- [x] Nodal graphing
  - [x] Basic layout
  - [x] Node editing
  - [x] Edge editing
  - [x] Label editing
  - [x] Formal Definition summary
    - [x] States
    - [x] Symbols
    - [x] Transitions
    - [x] Start State
    - [x] Final States
  - [x] String testing
    - [x] DFA
    - [x] NFA
  - [x] Export to image
  - [x] Circular auto-layout
  - [x] Step-By-Step mode
- [x] User-defined themes
- [x] Autosave system
- [x] Custom language
- [x] Offline capabilities

NOTE: Check out our CHANGELOG for more information!

---

## Getting Started

### Installing [Node.js](https://nodejs.org/en/)
This is required to test the program. Just get the current version and install it.

### Installing [Git](https://git-scm.com/)
This is required to edit the program remotely. Just get the current version and install it. The repository is hosted at [GitHub](https://github.com/andykuo1/flapjs).

### Installing [Atom.io](https://nodejs.org/en/)
This is not required, but recommended (by me). Just get the current version and install it.

Otherwise, you just need a text editor to write JavaScript, HTML, and CSS.

**Note:** Be sure to get the compatible versions for your operating system.

#### Recommended Atom Packages
* [Teletype](https://teletype.atom.io/)
  * A pair programming package for collaborative programming in real-time.
* [PlatformIO IDE Terminal](https://atom.io/packages/platformio-ide-terminal)
  * An integrated terminal for the `Atom.io` editor. Allows you easy access to run commands.

### Getting the remote repository
Open a command line or terminal and enter a directory to where to copy the project repository. This can be anywhere in your local file system (like your home directory). For example:

```
cd ~/
```

Then, clone the [repo](https://github.com/JFLAP/JFLAP-WebApp.git) to the directory.

```
git clone https://github.com/JFLAP/JFLAP-WebApp.git
```

Navigate into the directory of the repository.

```
cd JFLAP-WebApp
```

To ensure and verify the state of the repository enter the following command:

```
git status
```

### Installing dependencies
Open a command line or terminal and enter into the project directory. This should be where you've copied the remote repository. Following the previous example:

```
cd ~/JFLAP-WebApp
```

If you want to inspect the contents of this directory, it should contain the project files, such as `package.json`.

Then run the following command:

```
npm install
```

This should automatically start installing the dependencies (as listed in `package.json`). After it finishes, it should create a directory called `node_modules`, which contains all required dependencies.

**Note:** The `node_modules` directory sometimes contains files unique to each platform so this directory SHOULD NOT be committed to the repository.

**Note:** If a `package-lock.json` is created, it should be committed to the repo. It should not be ignored.

After that, the project is ready to run. _Happy coding!_

---

## Running the Program
After saving any changes to a file, open a command line or terminal and enter into the project directory.

**Note:** If using the recommended `Atom.io` package, the in-editor terminal is automatically opened at the project directory. (No need to `cd` every time!)

### Production Build
To "compile" the scripts for public distribution:

```
npm run build
```

**Note:** This will bundle all the resources and assets required into `dist`. It will also "uglify" the code to reduce size and apply other optimizations.

Then, open `index.html` in your web browser. Either by just opening the file itself or running the command:

```
open index.html
```

### Development Build
Another way to quickly run, or test, the program:

```
npm start
```

This will run all appropriate commands to bundle and build the program, then will run it in your default web browser. It is also hot loaded and in development mode, so changes will be reflected on save and debug messages are more human-readable.

**Note:** Running this way will start a local server on the machine at default port `3000`, or what is defined in `webpack.config.js`. Therefore, only one instance of the server can be open at one time (but as many clients as you want).

## Testing the Machine Functions
Tests are currently written in individual `.mjs` scripts located in the directory `debug` (**not** `.js`). These test scripts will be dynamically loaded when running the tester.

**Note:** Like other test environments, asserts and similar functionality can be found in `Tester.js`.

Similar to running the main program, after saving any changes to a machine or machine function file, open a command line or terminal and enter into the project directory. Then execute:

```
npm test
```

This will load all test written in `debug` and compute them. Once complete, the tester will report test results, successes, and failures.

It is recommended to write only a single `.mjs` file per function. And within each file, divide each test case by a local block. This is to ensure local variables do not contaminate other tests. For example:

```
//Test empty
{
  console.log("Testing empty...");
  ...
  console.log("Finished testing empty.");
}
```

**Note:** If a test runs into any errors or failures, any outputs gathered during computation are outputted in the order they occur, therefore `console.log` should print in the order expected. If a test was successful, all test output is consumed and not printed.

---

## Project Structure

### Entry point
The entry point for the code is in `src/index.js` (if bundled, this will be referred to by `index.html` through `dist/bundle.js`).

This script maintains all session-specific resources. Unlike page-specific details, it handles any actions or mechanics applied globally through the session. More specifically, it handles the rendering loop, the page routing (custom built for efficiency), the update cycle, and the window load and unload events. For future implementations, any events triggered by these actions should be handled here.

For static constants that persist throughout the program, these are kept in `config.js`. You must import the script to use these constants; they are not global (nor should they be).

**Note:** Most `React` code will be handled in their own page handlers, as the UI are page-specific. This script should only manage which page handler to update and render, and any other session setup.

### Pages
Subsequently, all pages are handled by their own page-specific scripts and should be in their own directory. A page should be treated like a typical HTML page; it is given complete control over the current page state and should be able to "link", or route, to other pages. For example, the app page is located in the `App` directory, with its respective `App.js` to handle all those page-specific resources. Most, if not all, `React` components should be handled here.


#### Component structure
`React` components are first divided into pages. There are currently 3 pages: `App`, `HomePage`, and `Page404`. Each are with their own respective directories with a matching `.js` file (and also usually a `.css` file).

Within these directories are further subsections of components that make up the page. This structure is up to the developer to maintain, since each page should never call cross-page functionality. If this function is required by more than one page, it should be either a `util` function or another script entirely; it should not be kept in the page's directory.

_**Note:** Be careful with class names. Currently CSS stylings are still applied globally. Therefore, do not style `body` or `button` directly. **Use unique class names.**_

#### Creating a Page
Simply create a `React` component, preferably in its own directory under `/pages`, and connect it to the router.

To enable hot-loading:

```
import React from 'react';
import { hot } from 'react-hot-loader';

class CustomPage extends React.Component
{
  ...
}

//For hotloading this class
export default hot(module)(CustomPage);
```

#### Adding another Page to the Router
Pages are referred to by their id listed in `index.js`, as mapped in the array `PAGES`. The id refers to the actual link the user will use to get to the page under the website's domain. The value of the entry is a reference to the `React` component that will serve as the page handler. These can be imported above. Any directories not mapped (therefore unknown) will be routed to a 404 page.

#### Routing to another Page
Each page is passed a reference to the router object. To route to another page, simply change `this.props.router.pathname` to the page id (as specified in the `PAGES` mapping). The next render step will then re-render to the specified page.

### App Page
The App page handles the graphing workspace of the website. The page itself only handles workspace-specific that are also session-specific details, such as the graph pipeline, event history, input controllers, auto-saving, error checking, notification system, and other related systems. Resources that change within the lifetime of the workspace session should be handled by its children.

#### Component structure
This page is further divided into 4 sections: the toolbar, the drawer, the viewport, and the workspace.

##### Toolbar
The toolbar contains all the quick tray icons and is always above all content and easily accessible from the user for quick actions. These include starting a new workspace, saving, exporting, etc. The help button is also available here.

Many of the buttons that serve a singular function have its functionality directly included within the component themselves. However, certain features that are more involved or are used elsewhere are kept as `util` functions or separate external scripts.

##### Drawer
The drawer contains all the collapsible, tabbable panels hidden on the side. It can be expanded through the expand arrow or by clicking the tab itself. The size of the panel itself can be adjusted by the user. It will display the currently selected of the various available panels.

Each panel will handle its own contents, while the drawer serves as a simple "router" to determine which panel to display. It will also handle any manipulations to the drawer container.

Currently, the drawer contains 4 tabs: `Testing`, `Definition`, `Exporting`, and `Options`. Most of these panels are self-contained, with the exception of the `Testing` panel.

###### Testing
The `Testing` panel is managed by a `TestingManager`. This is so testing data persists between workspace changes. In other words, the `Testing` panel renders the data found in `TestingManager`. Most of the testing functionality is derived from machine functions.

##### Viewport
The viewport is the top layer of the workspace. It fills the interactable area for the workspace, but does not handle any input events for it. Instead, it holds any `React` or DOM element overlays on the workspace, such as the `LabelEditor` or the `TrashCan`.

This serves as an overlay layer for the workspace.

##### Workspace
The workspace is the `React` component responsible for the rendered graph content. Nodes, edges, and other graph elements can be created, deleted, or edited on this layer.

All graph elements are rendered and manipulated here. The `InputController` will also listen on this layer for input events.

**Note:** Input events, although ignored by the viewport, can be blocked by elements on the viewport. These input events are not handled by InputController and instead will be handled by the target component.

### Graph Pipeline
There are 3 representations of a graph, with each abstracting from the user interface, the computation, and the rendering.

#### NodeGraph
The first layer directly manipulated by the user is the `NodeGraph`. It can represent any graph that contains nodes and edges with labels (including DFAs, PDAs, TMs, etc).

The purpose of this layer is to serve as the interface between user intention and graph representation. Although the graph _can_ represent any nodal graph, it does not mean it _should_ in the final output. However, these restrictions should be handled by the input controller or other handlers listening to its events to ensure logical and effective manipulation and also separation of responsibility.

The `NodeGraph` is comprised of `GraphNode` and `GraphEdge` objects, each with its own position, labels, and other properties to decorate a graph. The labels are just strings, and are not enforced to any format (as suggested earlier, formatting and other rules should be applied by other handlers).

Available events to listen for are listed at the top of `NodeGraph.js`.

#### Machines
This layer represents the mathematical definitions of the graph. Therefore, it provides functionality such as `getAlphabet` or `doClosureTransition` but are also specific to its machine type.

In each machine, named by their machine type (i.e. `DFA.js`, `NFA.js`, `FSA.js`), it will always maintain a valid state. Any changes that violate these rules should throw errors. This is to enforce proper construction for user and developer manipulation.

For symbol representation, these are maintained in `Symbols.js`. When considering the character representation in computing a machine, use these constants to allow easy change of symbols. For example, the empty transition, as represented by a lambda or an epsilon, is referred to as: `Symbols.EMPTY`. Other symbols can be added to the script.

##### MachineBuilder
In order to facilitate responses to these erroneous constructions, a `MachineBuilder` is used. The current valid machine of the workspace is maintained by a builder (i.e. `FSABuilder.js`) in `App` and derived from the `NodeGraph`. Its purpose is to enforce the rules of the machine on the user interactions. Actions and changes that violate these rules, or, in other words, throw errors, should either be reverted or be notified to the user through the builder. The machine is continually "rebuilt" by the builder on graph changes and therefore should have its content always in sync with the user's graph. Any custom rules should be implemented here.

**Note:** If certain actions or changes would result in critical errors, such as violating universal graph rules, then it should be implemented in the input controller to consume the action before it is performed.

**Note:** Expensive error-checking should be checked on intervals rather than only on change in order to save computation costs. Since these errors will not provide immediate feedback, the actions should not be reverted, but rather the user should be notified of the error instead. This also suggests that the output machine may not always be in sync with the graph. However, this is fine, since other functionality dependent on a machine expects a _valid_ graph and therefore should be disabled if this occurs.

**Note:** This representation loses the graphical data that allows it to be reconstructed back into its original `NodeGraph`, such as position or direction. Although mathematically similar, both are structurally different, which enables both to effectively serve their unique functions.

##### Machine functions
Certain functionality that requires non-negligible computation time are divided into machine-specific `util` functions. These include `convertNFA`, `minimizeFSA`, `solveNFA`, etc. These are often called by specific actions or buttons within the panels and other areas and will should only calculate on machines (not `NodeGraph`).

Each is stored in their own script and can be tested separately from the main program. Refer to [Testing the Machine Functions](#testing-the-machine-functions) for more information on how to test them.

#### GraphRenderer
This final layer evaluates the `NodeGraph` and constructs a renderable structure to display to the user. In other words, this is the `React` component representation of `NodeGraph`. Because of this abstraction, the graph could be rendered in `Canvas` or other rendering systems if required. Currently, the individual elements are rendered onto the workspace in `SVG` for scalability.

### InputAdapter
This handles all complex input manipulations of the graph workspace. All raw input (i.e. `onTouchStart`, `onMouseDown`) are first evaluated by `InputAdapter.js` into more abstract actions. Both touch and mouse actions are converted to abstracted input actions to simplify input logic.

#### InputController
These input actions (i.e. `onDragStart`, `onInputAction`) are then handled by `InputController.js`, which applies context-specific actions to the elements in the `NodeGraph`. In addition to the controller handling the input action events, it also emits events for external handlers to listen and respond to.

Available events to listen for are listed at the top of `InputController.js`.

**Note:** Certain groups of actions, such as selection, are handled by external handlers. This serves only to produce more organized code.

#### GraphPointer
The position, timing, initial state, and target are kept in a `GraphPointer`. Its most used contents are often passed as arguments to the event functions, but it can also be accessed through the controller by `this.pointer`. Refer to `GraphPointer.js` for more details.

### Auto-Saving
This is maintained by `AutoSaver.js`. The script will intermittently save on defined interval to local storage on the local system. This is handled by the browser and is specific to the browser. It is only initialized on component mount in `App.js`, and then it will update itself.

### Event History
This is maintained by `EventHistory.js`. The script will record all non-negligible events fired by `GraphInputController.js` and `NodeGraph.js`. On user request, the log is cleared, decreased, or increased.

### Eventable
This is a mixin class that enables emit/listen functionality for a class. It is currently used by `NodeGraph.js` and `GraphInputController.js`.

To fire an event:
```
this.emit("eventName", argument1, argument2, ...);
```

To listen to an event:
```
someHandler.on("eventName", (argument1, ...) => {
  //Some code here
});
```

To include `Eventable.js` in a class:
```
import Eventable from 'util/Eventable.js';
class SomeClass extends SomeOtherClass
{
  ...
}
Eventable.mixin(SomeClass);
```

### Notification System
`NotificationSystem.js` handles all notifications that are reported by other various components to the user. The messages can be grouped and searched by tags and sorted into various levels: `ERROR`, `WARNING`, `DEBUG`, `INFO`. Each message can also be dynamically altered by external handlers.


### Conclusion

If you have any more questions, please contact any Flap.js dev team member.

Or, you can contact me:
andykuo1supergreen@gmail.com
(Please begin the subject with 'Flap.js - ')

Thank you for reading me!