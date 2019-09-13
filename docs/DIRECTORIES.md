# Directories
What should be in each directory?

## docs
This includes all miscellaneous documentation that do not belong in `src`.

> **TL;DR** All other documentation.

## tools
This includes all scripts or tools used to manage the project (not used within the app itself). These usually should not be edited but can be contributed to for more utility.

> **TL;DR** All scripts or tools to manage the project files.

## build
This includes all production-ready distributed files. These files should never be edited as the directory will always be replaced on build.

> **TL;DR** All output files. DO NOT TOUCH THIS!

## coverage
This includes all generated code coverage output files. These files are automatically handled by the project and therefore should not be edited manually.

> **TL;DR** All code coverage output files. DO NOT TOUCH THIS!

## src
This includes all source files that make up the project. Any code, assets, etc. directly related to the app should be within here.

> **TL;DR** All your editable source code and assets.

### assets
This includes all static assets that will be used by the app. Things such as images, language files, and global scripts. Files in here usually should not be bundled with the app itself, unless closly coupled with that code.

> **TL;DR** Put everything that is not app code and style in here.

### components
This includes most of the code that pertains to the UI components that make up the app. This should have not only the source code that will run the component but also the tests and stylesheets.

> **TL;DR** All your component code, including scripts, tests, and styles.

### modules
This includes all of the code that belongs to specific modules. Each module has its own subdirectory named by its module id. The files within these directories can range from more UI code to module specific assets. There is not enforced file structure beyond the module parent directory, so each module should have some sort of description to explain themselves.

> **TL;DR** All module-specific code has their own subdirectory under here.

### tests
This includes all tests that do not belong elsewhere. This usually means tests that span multiple scripts or utility test functions.

> **TL;DR** All miscellanous tests that do not belong in components.

### util
This includes all utility files that do not serve any of the previous purposes.

> **TL;DR** All utility functions usable globally.

### deprecated
This includes all deprecated code. Try not to use this if you don't have to.

> **TL;DR** All deprecated functions to be avoided at all costs.