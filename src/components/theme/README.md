# Theme
This is the next step. The way data flows in this system is similar to the localization system, with one added caveat: data can also come from the user.

Here are all the inputs:
- User-controlled color options
- Theme files
- Module-defined color options
- CSS files

The remote theme files can be imported similar to how language files are imported. Since these don't change, they function exactly like language files (which means they can be safely cached).

Another major difference is that theme only has 1 consumer, the theme selector. For style options, these should reflect the registered styles, not the theme. The color VALUES are managed externally, so there is no data flow between components.

The redux way would be to create a "color" or "theme" store in the global scope. Then, for each controlled option, it would, similarly, dispatch actions to change it.

There are many ways to solve the bidirectional data flow, but the biggest issue is to allow modules to specify additional editable styles.

With this, we need a registry of sorts. A registry of styles.