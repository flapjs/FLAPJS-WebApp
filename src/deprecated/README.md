# Deprecated

This is all the deprecated code from the previous version.

We are trying to add tests, storybooks, documentation, and clarity to all files. However, this is a huge task to undertake in one go, so we are going to refactor it bit by bit.

We have the graph view refactored over, which is one of the largest chunks of code. There are still issues with it, most notably I18N no longer being a global variable, but it's mostly correct (since the linter passed).

Another possible issue with the refactor would probably be the missing RENDER call each frame. Now render is only called when something updates. Therefore, we must be extra careful to know what depends on what so that we can re-draw when necessary.

Also a lot of the managers have transformed into React Context Providers, meaning that they are only available after mounting. Some code are not made with this in mind, therefore would need to change the lifecycle for it.

Besides that, we need to implement a drawer system in the new drawer layout. Once custom panels can be added at will, with maybe something similar to DrawerManager, most of the modules can be moved in. We should probably try out the nodegraph module.
