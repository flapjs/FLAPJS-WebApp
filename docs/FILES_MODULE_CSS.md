# Module CSS files

Any scripts that ends with `.module.css` will be processed by `css-loader` and treated as a CSS module stylesheet. In other words, these stylesheets should only be used to apply local styles.

## What are CSS Modules
CSS modules are basically local stylesheets. To use them in a React component, you must import it as an object first.

```javascript
import Style from './path/to/stylesheet.module.css';
```

Then set the `className` to the name you want.

```html
    <div className={Style.someSelector}>
        <!-- Some other content... -->
    </div>
```

Now it will be styled for the selector `someSelector`! This also works for other selectors, like `id`.

To achieve this, CSS modules will basically extract all local class names and generate a unique, mostly random, name for it. Now, the stylesheet can be joined globally and there will be no conflicts!

## Other CSS Module Features
In addition to this feature, CSS modules also comes with a few other helpful things. In this project, we'll only be using a small subset of these, but they are there if you need them.

### Compose
One of these is the `compose` property. This let's you "compose" other classes such that, when being added as a name to a component, it will also assign the composed classes as well. For example:

```css
.first {
    composes: second;
    color: blue;
}

.second {
    background: green;
}
```

Now, where ever you use `.first`, it will also include `.second`. Neat huh?

## @value
Another cool property is `@value`. They are basically macros at the top of the file for arbitrary values. Things that don't change but are used in a lot of places, like colors, pre-defined widths/margins, etc.

```css
/** v- for values */
@value v-primary: #BG4040;
/** s- for selectors */
@value s-black: blackSelector;
/** m- for media */
@value m-large: (min-width: 960px);

.header {
    color: v-primary;
}

.s-black {
    background: black;
}

@media m-large {
    .header {
        padding: 0 20px;
    }
}
```

Although they are prefixed here, they don't need to be. It's just nice to know what they contain.

For more information, refer to the [CSS Modules](https://github.com/css-modules/css-modules) spec.

**NOTE:** Since CSS module files are currently only used as imported objects by `css-loader` in JavaScript, we use camelCase instead of kebab-case.

**IMPORTANT:** Due to how local styles are handled by the plugin, these stylesheets should ONLY CONTAIN CLASS NAME STYLES. Styles that directly apply to tag names or other selectors will apply globally and violate the modular contract. If you want global styles, just use a regular stylesheet (with the extension `.css`).

For example, this is acceptable.
```css
.classSelector {
    display: none;
}

.container h1 {
    font: monospace;
}
```

This is not.
```css
div .classSelector {
    display: none;
}

h1 {
    font: monospace;
}
```

**NOTE:** Since CSS module files are currently only used as imported objects by `css-loader` in JavaScript, we use camelCase instead of kebab-case.
