# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Language is saved across sessions.
- Regular expression scope highlighting.
- Cross-window communication through BroadcastChannel.
- Color theme preset loading.
- MIT and Duke theme presets.
- Added linting tests.
- Added Travic CI build pipeline.

### Changed
- Have actual changelog that is not code :P

### Removed
- Old app mode will be replaced by experimental mode permanently :(

## [0.4.0] - 2019-04-01
### Added
- Allow double-clicking module name to change modules.

### Changed
- Default color scheme. Hope you like it!

### Fixed
- Module change causes app to not respond.
- Auto-rename nodes cannot be toggled.

## [0.3.4] - 2019-03-27
### Added
- Meta tags for those coming from a search engine.
- A new PDA module for those who've been waiting for it :3
- AND a spankin' new Regular Expressions module.
- AND a whole NEW EXPERIMENTAL MODE! :D

## [0.3.3] - 2019-01-17
### Added
- SVG export option (thanks to moreheadm).
### Fixed
- Edge cannot be created with default symbols.
- Action mode does not show edge creation as an edit.
- Wrong undo state for changing initial marker.

## [0.3.2] - 2019-01-14
### Changed
- Disabled service worker while in development mode.

### Fixed
- Allow cross-platform bundling for project.
- Corrected 'development' mode while in production.
- NFA unreachable node checking is wrong (now it's correct).
- Unreachable node warnings were not treated as notification warnings.

## [0.3.1] - 2019-01-10
### Fixed
- Renaming an uploaded file does not download file with new name.
- This is our first user-reported bug! Hooray!
- Thank you and have a hug whoever you are <3.

## [0.2.0] - 2018-12-11
### Added
- Module system.
- Graph optimization options.
- In-app bug reporting.
- Jest unit tests.
- Pre/Post label options for nodes.
- DFA/NFA conversion warning for those trigger-happy folks.

### Changed
- Testing panel redesign.
- Allowed comma's to be valid edge and state labels
- Allowed user to save custom color theme

## [0.1.0] - 2018-08-29
### Added
- Interactive node graphing workspace for DFA and NFA.
- Basic auto-layout for nodes and edges.
- Node and edge manipulation.
- Edge label editing.
- Formal definition summary for DFA and NFA.
- String testing for DFA and NFA.
- Step-By-Step mode for testing DFA and NFA.
- DFA and NFA solvers.
- Exporting for images.
- Importing/exporting for local flap.js file.
- Importing/exporting for JFLAP file.
- Auto-save to LocalStorage.
- New welcome page for first-time users.
- A small tutorial for them as well :)
- Notification system to report errors and warnings.
- Undo/Redo system for graph manipulation.
- Hotkey system for quick undo/redo and other operations.
- Dynamic color theme system.
- I18N localization system.
- Localization for English and Pirate Speak.
- Offline capabilities with working ServiceWorker.

[Unreleased]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.2.0...v0.3.1
[0.2.0]: https://github.com/flapjs/FLAPJS-WebApp/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/flapjs/FLAPJS-WebApp/releases/tag/v0.1.0