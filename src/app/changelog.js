//Version 0.4.4
const changeLog = `
### Added
- Equivalence test for Finite Automata with witness string

### Fixed
- Too large workspace widget
`.split('\n');

/*
//Version 0.4.3
const changeLog = `
### Added
- The new Bab's tutorial

### Changed
- App will check for updates only if it can.

### Fixed
- Missing test highlights.
- Missing edge formatting.
- Weird collapse for menu screen.
`.split('\n');

//Version 0.4.2
const changeLog = `
### Added
- Module version is now visible in Options.
- Change machine type for FA module in the title bar.
- A new and improved graph picking system.
- Allow clicking on labels to edit them.
- Custom node color styles are now applied to exported images.
- Grayscale image exporting.

### Changed
- Menu entries are now ordered more logically.
- Fullscreen mode is available for ALL modules.
- Trash can looks nicer when red :D
- A new menu design.

### Removed
- Unused modules are no longer visible in module selection.

### Fixed
- Previous labels sometimes show up in future label editors.
- FA/PDA: Auto-formatting sometimes fails for edge labels.
- FA/PDA: Initial marker cannot be dragged with left mouse button.
- FA/PDA: State label editing won't save.
- FA/PDA: Trash can icon is missing label.
- FA/PDA: Trash can cannot delete edges.
- FA/PDA: Missing red border for delete mode.
`.split('\n');

//Version 0.4.1
const changeLog = [
    'Experimental mode is now LIVE! :D',
    'Pushdown Automata & Regular Expression modules are now available.',
    'Language is saved across sessions.',
    'Regular expression scope highlighting.',
    'Color theme preset loading.',
    'MIT and Duke theme presets.',
    'Added linting tests to enforce code style.',
    'Added Travic CI build pipeline for more build automation.',
    'Old app mode will be replaced by experimental mode permanently.',
];

//Version 0.4.0
const changeLog = [
    'Changed default color scheme. Hope you like it!',
    'Allow double-clicking module name to change modules.',
    'FIXED: Module change causes app to not respond.',
    'FIXED: Auto-rename nodes cannot be toggled.'
];

//Version 0.3.4
const changeLog = [
    'Added meta tags for those coming from a search engine.',
    'Added Pushdown Automata',
    'Added Regular Expressions',
    'Added a whole NEW EXPERIMENTAL MODE! :D'
];

//Version 0.3.3
const changeLog = [
    'ADDED: SVG export option (thanks to moreheadm).',
    'FIXED: Edge cannot be created with default symbols.',
    'FIXED: Action mode does not show edge creation as an edit.',
    'FIXED: Wrong undo state for changing initial marker.'
];

//Version 0.3.2
const changeLog = [
    'FIXED: Allow cross-platform bundle building.',
    'FIXED: Corrected \'development\' mode while in production.',
    'FIXED: NFA unreachable node checking is wrong.',
    'FIXED: Unreachable node warnings were not treated as notification warnings.',
    'Disabled service worker while in \'development\' mode.'
];

//Version 0.3.1
const changeLog = [
    'FIXED: Renaming an uploaded file does not download file with new name.',
    'This is our first user-reported bug! Hooray!',
    'Thank you and have a hug whoever you are <3.'
];
*/

const changeVersion = process.env.VERSION;
const result = {
    show: changeLog && changeLog.length > 0,
    log: '\nChangelog v' + changeVersion + ':\n - ' + changeLog.join('\n - '),
    version: changeVersion
};
export default result;
