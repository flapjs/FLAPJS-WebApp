When you are creating a new component, you have to think about how it is used. There are a couple types of components I've built so far.

- Ones that expect specific children to be provided (often with specific structure). These are the "formatters", such as panels, toolbars, views, etc.
    - Following the previous, ones that are ONLY used as children for those cases. These are specific sub-panels, contextual buttons, etc.
- Ones that are expected to work anywhere. These are the icons, buttons, inputs, etc.

Those are pretty much all the patterns that should exist. If it falls somewhere in the middle, consider a redesign. Either have it completely modular and fit it anywhere, or dictate an "interface" structure for the user.

All data should NEVER be kept in the component. ONLY state that is completely managed by the component and will NEVER have outside influences can be kept in the component.

This makes it so we always manage state at the highest level.

-=-= STYLING =-=-
As for style, there are 2:
- One that "controls" the component. Things like sliding, positioning, etc. These are essential to the component and the component would break down if any of these were changed.
- The other that makes the component look good. Things like color, size etc. These are EXPECTED to be changed by the user, since style really depends on the context.

For the first kind of style, it should ALWAYS be local. That way no one has access to it, except you.
For the second kind of style, it should ALWAYS be global. This would allow users of the component to override your changes. Be careful though, you should the same namespace as all other components, so be careful of your choices of names.

And follow these guidlines:
https://medium.com/better-practices/building-highly-customizable-react-components-838df56ff575



What is it used for?
Input?
Output?
Side effects?
Dependencies?
What does it NOT do?

If your component REQUIRES certain props, do make sure the user is aware.

Give an minimum use case.

