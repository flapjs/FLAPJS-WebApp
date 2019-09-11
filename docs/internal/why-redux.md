# Why Redux, dude?

So state is getting complicated. I've implemented a few subsystems, each managing their part of the application in their own way. There is currently is no way to debug the data flow efficiently without brute force tracing the program. So, for maintainability sake, this is an issue.

Now I have heard many people use Redux for this. Of course, we must be skeptical but open-minded. Especially when considering new tools. Just because something is popular, doesn't mean it is right.

Through my research, I have come down to these four things:

## Redux, Flux, React Context, and MVC

Now MVC and Flux are both design patterns, whereas Redux and React Context are actual code. Some may argue that Redux is an implementation of Flux, but there are differences from choosing one and not the other. For starters, using Redux gains not only its usability, but also its complexities. Flux on the other hand is much more compact. Also, Flux is designed for multiple stores, whereas Redux is designed for a single global store.

Some may also argue that Flux is just a better MVC for web development. I would partially agree with that statement. Flux is a solution to a specific type of MVC structure: where there are multiple view-controller relationships that go both ways. MVC only assumes one. So unless you have a complex network of view-controllers talking to each other, you should just stick with good ol' MVC for clarity's and simplicity's sake.

React Context is actually built into React and could be used alongside any of these tools. It is simply a way to provide a value at the global level to consumers (from providers). Although it looks quite similar to Redux, it cannot replace it. React Context starts at global values and stops there as well. It does not handle actions, reducers, etc. But this is probably very useful if coupled with other designe patterns that need some sort of value-passing without prop-drilling.

But the core ideals behind all these designs lie in the division between Presentational and Container components.
- Presentational components are your regular React components that simply render things. They do not manage any external state. These should be dead simple.
- Container components manage state and state only. They do not render things.

This allows a separation of the presentation and data. This not only facilitates better division of responsibility, but also maintainability, since we can simply change out the presentation and keep the data logic and vice versa.

## My Solution

Anyways, from the current project structure, I've come up with what I think we need to implement a state manager for:

- Arbitrary module session data
- Notifications
- Theme (CSS Variables)
- Localization
- Graph/Grammar

Here's the result of that:

### Modules
Modules should be able to use whatever they want. Therefore we need a way to allow them to use Redux, Context, just singletons, or local state... (currently still figuring this out)

### Notifications
Notifications should use REDUX
- Because it usually deals with the graph itself, like an editor. Therefore it should use the same management system.
- It is also useful to undo/redo notification actions.

### Themes
Theme Styles should use MVC / React Context
- ThemeView, ThemeModel, ThemeController
    - View would be the usage of CSS variables
    - Model would be the color values stored in ThemeManager.
    - Controller would be the color options
    - (React context to change the colors)

### Localization
Localization should use React Context and a custom Localize Component
- This is because there are pretty much no interactions that need to be managed here.
- There is one state and that is the locale. And that is usually only changed in one place too.
- The only problem is that it is used everywhere. So this should probably be a React Context thing.

Here's an example implementation:

```jsx
    <Localization.Provider>
        <LocaleString entity="user.name"/> // <-- this already has Consumer in it.
        // To change locale code...
        <Localization.Consumer>
            {
                (context) => {
                    <button onClick={() => context.changeLocale('en')}>
                    Change Language
                    </button>
                }
            }
        </Localization.Consumer>
    </Localization.Provider>
```

### Graph and Grammar
Graph should use REDUX
- Drawer Editor vs Graph Editor
    - Both dispatch actions to the store
    - The store updates and re-renders the views for Drawer and Graph.
- How would you do undo/redo?
    - The store will keep track of actions and when to save them.
    - Things like position actions, would only save state when STOPPED moving.
- How would you connect store to components?
    - React Context and presentational components.
- Why not redux? You get undo/redo for free and it has dev tools.
    - How would you implement position action states? (enhancers)

## Conclusion
We will be using Redux. But only for ALL GRAPHING/GRAMMAR functionality. Most component states will still be local or in some sort of manager. Redux is usful only if it is actually beneficial. There is no point to manage the state of the entire app, since the rest of the app don't really interact with each other much. If complexity rises elsewhere, this system would be already in-place to correct it (unless you find a better alternative). Hopefully this helps.

## Resources
// THESE ARE GOOD ONES:
- https://learn.co/lessons/react-stores 
- https://www.freecodecamp.org/news/where-do-i-belong-a-guide-to-saving-react-component-data-in-state-store-static-and-this-c49b335e2a00/


// THESE ARE OKAY:
- https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux
- https://medium.com/@dakota.lillie/flux-vs-redux-a-comparison-bbd5000d5111
- https://marmelab.com/blog/2018/06/27/redux-or-not-redux.html
- https://frontarm.com/james-k-nelson/when-context-replaces-redux/
- https://hackernoon.com/reacts-new-context-api-b29d442d5abc
- https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367
- https://redux.js.org/recipes/implementing-undo-history
- https://reactjs.org/docs/context.html
- https://redux-docs.netlify.com/basics/usage-with-react


// YOU'LL NEED THESE TO IMPLEMENT:
- https://react-redux.js.org/introduction/quick-start
- https://alligator.io/react/storybook-with-redux/
- https://daveceddia.com/redux-tutorial/
