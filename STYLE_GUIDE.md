# Style Guide
* Use American English.
	- OK: `color`
	- NOT: `colour`
* Use [serial commas][].
* Use camelCase for instances, functions and variables.
* Use PascalCase for constructors (like classes).
* Use an underscore in the front to signify private scope.
	- this._privateMember
	- this.publicMember
* Use the Allman style of indentation for code.
	- That means every curly brace is on it's own line (with a few exceptions for one-liners).
* When referring to methods in comments, use parentheses.
	- OK: `node.onStart()`
	- NOT: `node.onStart`
* Use correct capitalization when referencing other projects.
	- OK: `JavaScript`, `Node.js`
	- NOT: `Javascript`, `NodeJS`
* Refer to the linter for more specific guidelines.

## JavaScript
* Use a semi-colon for the end of every statement.
* Use ES6 `class` instead of `prototype`.
* Use absolute paths for imports.
* Use default exports only for constructors or "global" instances.
* Put `export default` at the end of the file (not by declaration) if used.

## Git Branches
* Use tags to mark release versions of the app, such as `v1.0.0`.
* Prepend branch name with type separated by a forward slash.
	- OK: `review/SP19A_Andrew`
	- NOT: `reviewCodeAndrewSP19`
* Use `feature/` when adding new features to app.
	- OK: `feature/burger`
	- NOT: `burger-feature`
* Use `release/` when prepping for a release.
	- OK: `release/build-1.0.0`
	- NOT: `1.0.0.build2`
* Use `hotfix/` when fixing any immediate issues or bugs.
	- OK: `hotfix/ghost_comma`
	- NOT: `ghost_comma_bug_fix`

[serial commas]: https://en.wikipedia.org/wiki/Serial_comma