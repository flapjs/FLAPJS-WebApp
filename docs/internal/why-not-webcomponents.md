# Why Not Web Components?

Don't get me wrong, I think Web Components are the future. It's compatible everywhere, by every browser. It is, afterall, a web STANDARD. But this entire code base is written with React and therefore, due to legacy, must remain in the React ecosystem.

However, this does not mean we can't slowly migrate to web components for the newer implementations. If we've designed this correctly, the modules can be platform agnostic. They should be able to use React, Vue, Angular, Lit-Html, or anything they want. Of course, they would be forcing the user to download TWO SEPARATE UI libraries, but hey, if it is absolutely necessary.

So to bridge the gap between the app itself and the module system... we need a system that facilitates data passing between React and the other library.

... external event handler?

Flap.EVENTS.on('change', (ref, ...state) =>
{
    // update self?
});

https://www.robinwieruch.de/react-web-components
https://codeburst.io/integrate-custom-elements-into-react-app-ef38eba12905
https://coryrylan.com/blog/using-web-components-in-react
