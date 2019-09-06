# Andrew's Awesome React (And JavaScript) Tutorial

## Introduction
Welcome to my [React.js](https://reactjs.org/) tutorial. This should provide you the basics to get started on any React project. I will be guiding you through a list of tutorials written by the wonderful programmers of the Internet and showing you what React is and how to use it. Whether you kinda know what's going on or have no idea, this is the tutorial for you.

Due to the vast amount of material that I have to cover, I do not have time to go over everything. So we won't. We will however be going over the essential basics that should allow you to start on a React project and to know where to look for help when needed. For this reason, I have not only included tutorials but also references.

And since I myself have not written these tutorials, some parts may be irrelevant or confusing within this tutorial's context. Therefore, before reading each tutorial, I suggest you also take a look at the section I wrote for it down below first. Basically, if you follow the flow of this document, you should be fine. If you get lost, there is a table of contents. Hopefully that is helpful. There are guiding questions as well which pinpoint what kinds of topics you should focus on. For your own benefit, try to answer the questions first before looking at the answer.

## Table of Contents
- [The Prerequisites](#the-prerequisites)
- [The HTML Tutorial](#the-html-tutorial)
- [The CSS Tutorial](#the-css-tutorial)
- [The JavaScript Tutorial](#the-javascript-tutorial)
- [The React Tutorial](#the-react-tutorial)
  - [Part 1: Introduction To React](#part-1-introduction-to-react)
  - [Part 2: Setting up React](#part-2-setting-up-react)
  - [Part 3: Your First React App](#part-3-your-first-react-app)
  - [Part 4: Some Import-ant ES6 Stuff](#part-4-some-import-ant-es6-stuff)
  - [Part 5: Diving Into React](#part-5-diving-into-react)
  - [Part 6: Actually Making Useful React Components](#part-6-actually-making-useful-react-components)
- [More References](#more-references)
- [The Conclusion](#the-conclusion)

Finally, without further ado, here is the tutorial.

---

## The Prerequisites
There are also a few things you must do BEFORE you start this tutorial:
1. Install [Node.js](https://nodejs.org) (or update to latest version).
2. Install [Node Package Manager](https://www.npmjs.com) (or update).
3. Know some basic `cmd` or `bash` commands (things like `cd` and stuff, nothing fancy).

> NOTE: When you do any install / updates, be sure to restart your command prompt or terminal.

## The HTML Tutorial

HTML stands for HyperText Markup Language. It's used to layout and semantically describe your website. Within the scope of the web, HTML is the structure, whilst JavaScript is the logic and CSS is the style.

HTML is basically XML, a language that uses tags to describe things.

Here's an example of a standard web page:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>The Webpage About Stuff</title>
  </head>
  <body>
    <h1>The Webpage About Stuff</h1>
    <p>Here's some stuff about this page.</p>
    <button onclick="console.log('woot')">I am a button</button>

    <section>
      <h2>Here's a List of Items</h2>
      <ul>
        <li>Item #1</li>
        <li>Item #2</li>
        <li>Item #3</li>
      </ul>
    </section>
  </body>
</html>
```

You'll notice that tags are defined within `<...>` and every tag has a corresponding end tag `</...>` of the same name. Every tag must be closed this way, with content usually placed in-between. Attributes, like the `onclick`, can also be specified on opening tags. They are ways to pass data to the tag and usually customize the tag's functionality. One important thing to note is that it CAN ONLY BE A STRING. There are no other data types. For instance, the `onclick` attribute in the previous example is a text string of an executable JavaScript code. When the button is clicked, the browser will first parse the string to JavaScript code then execute it. This goes for numbers and other things as well. Be aware of this when working with different data types.

You may also realize that tags usually contain other tags. This nesting of tags creates a sort of tree with parent and child relationships. Behind the scenes, the eventual output of this markup is called the DOM tree, which is basically what a web page is (we won't go much more into this, but it is an important facet of web dev that you should look into in the future. For now just know it exists).

Generally, to use HTML effectively, you need to know when certain tags are appropriate for which situations. I will explain the larger concepts that will help you determine which is better, and I will also go over most commonly used tags. But there is still much, much more.

**Inline vs Block**
Inline refers to being on the same flow/line as the content it is next to. This would be tags like `<span>`, `<b>` (bold), or `<a>` (link). Block will divide content onto its own line, leaving whitespace between text. This would be tags like `<div>`, `<p>` (paragraph), or `<h1>` (header).

**Semantic vs Non-Semantic**
Semantic tags describe what a block of content _means_. It does not change the way it looks, but it changes the way it is treated. When you see a `<article>` tag, you would assume it is an independent, cohesive block of content. However, stylistically, content within an `<article>` block, without additional styling with CSS, looks the same as a `<div>` block (which means "division"). This is important because this description lets other programmers and programs reading the code understand what is going on. A common practice for web devs is to employ an endless nesting of `<div>` and `<span>` tags. These tags also divide content, but no one can tell what the content is suppose to do. Bottomline, use semantic tags when you can (basically any tag that is not `div` or `span`), and use non-semantic tags if the content really doesn't mean anything.

> More info: https://www.lifewire.com/why-use-semantic-html-3468271

As for the general format of a webpage, it is a web standard to include the top root `<html>`, a special starting tag `<!DOCTYPE html>` and a `<head>` and `<body>` block. The `<head>` usually contains all setup information, and the `<body>` contains the actual viewed content.

## The CSS Tutorial
CSS stands for Cascading StyleSheet. It is used to provide style to a web page.

Here's an example:
```css
h1 {
  font-family: monospace;
  font-size: 14pt;
  background: blue;
  color: black;
}
header > label {
  opacity: 0.5;
  color: white;
}
```

CSS styles an HTML page by finding (or "selecting") tags and applying a group of styles, as found with `{...}`, to it. The style attributes are pre-defined and you can easily lookup what you want to do and probably find an attribute to achieve that effect.

The more involved part is the selection. Before each block of styles is a CSS selector that determines what tags should the styles be applied to. These are rules to find what tags should be styled.

Here's a good tutorial to get you familiar with CSS Selectors.

> Link: https://css-tricks.com/how-css-selectors-work/

Before we continue, there is one thing I have found very useful in organizing responsive web pages. It's the `flex-box`. It will make your life easier.

Here's to get you started on what it is:
> Link: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox

Here's a complete reference for it:
> Link: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

And that should get you started. The complexity of CSS really stems from knowing which style attributes you need to add and how to select the appropriate tags to do so. If you are interested, look into attributes like `transition` for fancy transition effects, `keyframes` for custom animations, etc.

## The JavaScript Tutorial
Before you start React stuff, you do need to know JavaScript (and the new ES6 JavaScript features). Don't worry, we have a couple tutorials to do just that:
1. https://jgthms.com/javascript-in-14-minutes/
2. Arrow Functions: https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/
3. Classes: https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes
4. More ES6 Stuff: https://codeburst.io/es6-tutorial-for-beginners-5f3c4e7960be

REFERENCE: https://javascript.info/ - Has a list of modern JavaScript features and also guides to how to use them.

REFERENCE: https://developer.mozilla.org/en-US/ - Anything related to the current web standards.

Things you should know now:
- How do you create objects? How do you set and get properties of that object?
  - What does it mean to 'new' or 'delete' something?
<details>
  <summary>Answer</summary>
  <p>
    You can create objects with curly braces. Then, to set a property, use the dot access operator. Similarly, you can set it the same way, but with an assignment operator afterwards.
  </p>
  <pre><code>
const newObject = {
  someProp: "hello"
};
console.log(newObject.someProp); // Prints "hello"
newObject.otherProp = 1;
console.log(newObject.otherProp); // Prints "1"
  </code></pre>
  <p>
    The 'new' keyword is used with classes to create a new instance of that class. The 'delete' keyword is NOT used in the same context. Instead, 'delete' is for removing a property from an object, which is not the same as setting a property to null. The 'delete' operation actually removes the value AND key from the object, whereas setting null simply changes the value of the entry.
  </p>
  <pre><code>
class HelloWorld
{
  constructor()
  {
    this.message = "Hello";
  }
}
const helloWorld = new HelloWorld();
console.log(helloWorld.message); // Prints "Hello"
const anotherObject = {
  someProp: "yoohoo"
};
console.log(anotherObject.someProp); // Prints "yoohoo"
delete anotherObject.someProp;
console.log(anotherObject.someProp); // Undefined
  </code></pre>
</details>

- Do you know the 3 ways to create a function? What is the difference between them?

<details>
  <summary>Answer</summary>
  <pre><code>
// Named function defined on load.
function helloWorld1() {}
// Unnamed function but defined during execution.
const helloWorld2 = function() {};
// Anonymous function that binds the local context automatically.
const helloWorld3 = () => {};
  </code></pre>
</details>

- How do you create a class? How is polymorphism different in JavaScript? In other words, do you know what prototype is?

<details>
  <summary>Answer</summary>
  <p>
    Polymorphism in JavaScript is done through prototyping. Through syntactic sugar it can appear like normal Java-like polymorphism, but implementation-wise it is not. I just want you to be aware of this, since not ALL Java-like polymorphism behaviors are the same here. But if you aren't doing anything fancy, you should be fine. This is an advanced and involved topic. Please look it up for further detail if you are stuck.
  </p>
  <p>But here's how you make a class.</p>
  <pre><code>
class HelloWorld
{
constructor()
{
  // ...
}
}
  </code></pre>
</details>

- What data structures are built-in to JavaScript?
  - How do you create an array?
  - A map (there's 2 ways to do this)?
  - A set?
  - What else is there (there's 2 more)?

<details>
  <summary>Answer</summary>
  <p>
    Array, Set, Map, WeakSet, and WeakMap.
  </p>
  <pre><code>
const array1 = new Array(10);
const array2 = [];
const set1 = new Set();
const map1 = new Map();
// etc.
  </code></pre>
</details>

- How do you iterate over the array?
  - What's the difference between 'for-in', 'for-of' and 'forEach()'.
  - What does 'map()', 'reduce()', and 'filter()' do? More specifically, what do they output?


<details>
  <summary>Answer</summary>
  <p>
    You can use for-loops to go over an array, either through indexing or for-each.
  </p>
  <p>
    As for the differences between each type, 'for-in' iterates over the "keys" of the iterable target. Since this is an array, this means its indices. 'for-of' iterates over the values, which is usually what you want. 'forEach' is a function call that takes a callback function to handle each entry of the array. 
  </p>
  <p>
    Finally, the 3 functions defined above help you manipulate the array and will return a NEW array with those modifications. In other words, it will not modify the existing array.
  </p>
</details>

## The React Tutorial
Now on to the good stuff.

### Part 1: Introduction to React
This first one is mostly for reference but also serves as sorta a taste of what React is. Have a read through it. You should also try answering the challenges in the conclusion. They are helpful.

What you should take away from this:
- What is a component?

<details>
  <summary>Answer</summary>
  <p>
    A component is the basic building block of a React app. It is the button, the panel, etc.
  </p>
</details>

- What is JSX and how do you use it?

<details>
  <summary>Answer</summary>
  <p>
    JSX is a way to describe the structure of the component by using HTML syntax in JavaScript. You will often only use JSX in the render() function. However, you can also use JavaScript logic within JSX to add/remove HTML content dynamically. This can be done by escaping JSX with '{...}' and then writing JavaScript logic within.
  </p>
</details>

- When to use Stateless vs Class components?

<details>
  <summary>Answer</summary>
  <p>
    Class components are useful when you need complex logic or state management. Otherwise, stateless components are easier and faster to work with.
  </p>
</details>

- What is the difference between State vs Props?

<details>
  <summary>Answer</summary>
  <p>
    State is created/managed within the component and can be modified by the component. Props is given by the user of the component, and CANNOT be changed by the component itself.
  </p>
</details>

- What is destructuring (not related to destructors in C++) in JavaScript?

<details>
  <summary>Answer</summary>
  <p>
    Don't worry too much about this one. It makes more sense when you actually use it. For now, just know what it looks like.
  </p>
  <p>Here's some parameter destructuring.</p>
  <pre><code>
function choose(...items)
{
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
  </code></pre>
  <p>Here's some object destructuring.</p>
  <pre><code>
const props = {
  margin: 0,
  background: 'black',
  boo: true,
  hoo: false,
  wam: true
};
const [margin, background, ...other] = props;
console.log(margin); // Prints "0"
console.log(...other); // Prints "true false true"
  </code></pre>
</details>

- How does React actually know about and render your components?
  - What is ReactDOM?

<details>
  <summary>Answer</summary>
  <p>
    For the root component, such as 'App.js', you must call ReactDOM.render(appComponent). For all other components, it must be imported and rendered by another component. Mostly, this would be some sort of container component, or the App component itself.
  </p>
</details>

After all that, grab your favorite text editor and move on to the second one!

> Link: [React Tutorial For Beginners](https://ihatetomatoes.net/react-tutorial-for-beginners/)

> Progress (1/6)

### Part 2: Setting up React
This will help you setup a basic React environment so you can start building stuff! If you prefer a video over text, there's an identical video guide at the top of the page. Before you start however, there is a couple things you need to do.

The setup:
1. First, create a new directory somewhere. This will be the example project folder. Then open command prompt, or a terminal, to that directory.
```bash
cd ./the/path/to/your/project/directory
```
2. Then, run `npm init` in that directory.
3. Next, when following the tutorial, it will first ask you to run `npm install -g create-react-app`. You do not need to use `-g` in the command. Use `npm install create-react-app` (the flag is omitted) instead. The `g` flag will install the package globally, but we will only be using this package for this tutorial. If you did install it globally, don't worry. Just uninstall it later with `npm uninstall create-react-app`.
4. And you should now follow the tutorial! (There are a few more notes below to help you out).

Additional notes:
> NOTE: `chord` is just the project name. You can name it whatever you want :D

> NOTE: If you run into issues with `node` or `npm` commands, try making sure you have the latest npm and node versions. You can check by doing `npm --version` and `node --version`. You can try updating by following this guide:
https://docs.npmjs.com/try-the-latest-stable-version-of-npm

> NOTE: For updating on windows, this may be useful. Just follow the README; you don't need to download the source code on the github page.
https://github.com/felixrieseberg/npm-windows-upgrade

What you should be able to answer from this:
- How do you setup a React environment?

<details>
  <summary>Answer</summary>
  <p>
    You should follow the tutorial more closely. If that's not helpful, try looking online. There are too many small details to put here.
  </p>
</details>

- How to create a React component and render it?
  - Can you make a React component that renders a static list of fruits?
    - HINT: Try the [`<ul>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul).
    - ANOTHER HINT: You should be able to use the same React component file "template" you used for HelloWorld. If you create a new file, don't forget to `import` it. React won't know what to render if you don't tell it where to find the componet. Look in `index.js` and `App.js` to see how the tutorial tells React what to render.

<details>
  <summary>Answer</summary>
  <pre><code>
// ... boilerplate code ...
function render()
{
  return (
    &lt;ul>
      &lt;li>Item 1&lt;/li>
      &lt;li>Item 2&lt;/li>
      &lt;li>Item 3&lt;/li>
    &lt;/ul>
  );
}
  </code></pre>
</details>

> Link: [How To Create Your First React App](https://coderjourney.com/tutorials/how-to-create-your-first-react-app/)

> Progress (2/6)

### Part 3: Your First React App
This will help you build your first component (and introduce props and states).

Before we start this tutorial, rename `App.js` to `Hello.js`. Then change the name of the class `App` to `Hello`. You will also need to change `export default App;` to `export default Hello;` at the bottom of the file.
In `index.js`, change `import App from 'App';` to `import Hello from 'Hello';`. That should be everything you need.

Here are some notes while you go through the tutorial:

> NOTE: There is a typo in "Event Handlers". The render method should be:
```javascript
render()
{
  return (
    <div>
      <h1>Hello {this.state.message}!</h1>
      <button onClick={this.updateMessage}>Click me!</button>
    </div>
  );
}
```

Now follow this tutorial (you can skip the setup). When complete, move on to the next one!

What you should learn:
- How can you render dynamic, stateful components? In other words, how can I render something that depends on state or props?
  - HINT: Is it possible to write JavaScript in JSX? If so, how would you do this?
  - ANOTHER HINT: What is JSX escaping?

<details>
  <summary>Answer</summary>
  <pre><code>
// ... boilerplate code ...
function render()
{
  const hide = this.props.hide;
  return (
    &lt;section>
      {hide ? null : &lt;b>Hello, I am visible.&lt;/b>}
    &lt;/section>
  );
}
  </code></pre>
</details>

- How can you change the state?

<details>
  <summary>Answer</summary>
  <p>Use this.setState({ someStateName: someStateValue }). Do NOT do this.state.someStateName = someStateValue.</p>
</details>

- How about props?

<details>
  <summary>Answer</summary>
  <p>You can't. Props can only be changed by the parent component.</p>
</details>

- How can you add event handlers? More concretely, how do you do something on button click?
  - Why do we need to bind the function?

<details>
  <summary>Answer</summary>
  <pre><code>
class HelloWorld extends Component
{
  constructor(props)
  {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e)
  {
    console.log('click');
  }
  render()
  {
    return (
      &lt;button onClick={this.onClick}>Click Me</button>
    );
  }
}
  </code></pre>
</details>

> Link: [Learn React.js in 5 Minutes](https://www.freecodecamp.org/news/learn-react-js-in-5-minutes-526472d292f4/)

> Progress (3/6)

### Part 4: Some Import-ant ES6 Stuff
This will go over the concepts of import / export in ES6 (ES6 is a version of JavaScript, like ES5, ES4, etc.).

So you'll notice this has nothing to do with React. However, it does describe something that is used a lot in JavaScript and, to write proper code, we need to understand what it is and how to use it.

I want to point out that when you import a file that has a default export, there is no restriction on the name of the imported file.

Like if you do:
```javascript
import Hello from 'Hello.js';
```

It is exactly the same imported object as:
```javascript
import ASDFWOOT from 'Hello.js';
```

Although they have different names, they will reference the same `export default Hello` class. The difference is when you use it, you use the "import" name. So the Hello component, becomes a ASDFWOOT component.

```javascript
  import Hello from 'Hello.js';
  import ASDFWOOT from 'Hello.js';
  //...
  <div>
    <Hello/>
    <ASDFWOOT/>
  </div>
```

Although this is allowed, this is bad practice. We would not know what `ASDFWOOT` is and we would have to look for the import statement in order to know what it actually means. Since we want to have readable code, the proper convention is to name it EXACTLY the same as the exported name. There is an argument to be made for using only named exports (not export default), but if we follow this convention, we should be fine.

NOTE: You can only have 1 `export default`, but you can have many named `export`.

> Link: [ES6 Import Export - A Beginner's Guide](https://www.adamcowley.co.uk/javascript/es6-import-export-a-beginners-guide/)

---

#### **QUIZ TIME!!!**

**QUESTION 1**

Let's say I want to use the Car class in my code:

`OtherFile.js`
```javascript
function rentACar(money)
{
  //... some code here ...
  return new Car();
}

// ... other functions ...
```

However, the Car class is in another file (in the same directory).

`Car.js`
```javascript
class Car
{
  constructor(/** some arguments **/)
  {
    // ... some setup code ...
  }
}
```

**How would I change the files so that I can get a reference to the Car class in `OtherFile.js`?**

<details>
  <summary>Answer</summary>
  <p>
    <code>Car.js</code>
    <pre><code>
class Car
{
  // ... the same code ...
}

// CHANGES: Added this line below, at end of file.
export default Car;
    </code></pre>
    <code>OtherFile.js</code>
    <pre><code>
import Car from './Car.js';
// CHANGES: Added this line above, at start of file.

function rentACar(money)
{
  // ... the same code ...
  return new Car();
}
    </code></pre>
  </p>
</details>

**QUESTION 2**

Let's say I have another file, in the parent directory, that contains a list of math helper functions called `MathHelper.js`.

`MathHelper.js`
```javascript
function distance(a, b)
{
  // ... code ...
}

function power(a, b)
{
  // ... code ...
}
```

**I want to use this in my `rentACar()` function. How would I change the files so that I can get a reference to both `power()` and `distance()` functions in `OtherFile.js`?**

<details>
  <summary>Answer</summary>
  <p>
    <code>MathHelper.js</code>
    <pre><code>
// CHANGES: Added 'export' to the front of the function we want to use.
export function distance(a, b)
{
  // ... code ...
}

// CHANGES: Added 'export' to the front of the function we want to use.
export function power(a, b)
{
  // ... code ...
}
    </code></pre>
    <code>OtherFile.js</code>
    <pre><code>
import Car from './Car.js';
import { distance, power } from '../MathHelper.js';
// CHANGES: Added this line above, at start of file.

// NOTE: To use it, you can straight up just reference it:
//    distance(0, 1);
//    power(10, 10);

// NOTE: You can also do:
//    import * as MathHelper from '../MathHelper.js';
// And to use it, you'll have to do:
//    MathHelper.distance()

function rentACar(money)
{
  // ... the same code ...
  return new Car();
}
    </code></pre>
  </p>
</details>


// TODO: But what if you have a `power()` function in `OtherFile.js` but you also want to use the `power()` function from `MathHelper.js`?
//

**But let's say I already have a function named `power()` in `OtherFile.js`. However, I also want to use the `power()` function from `MathHelper.js`, which will cause a name conflict. What would I do now?**

<details>
  <summary>Answer</summary>
  <p>
    You still do the same thing, except change the name of the imported module, using an alias. In the previous example, you could have used `* as MathHelper` to import the files. The `as MathHelper` part is actually an alias. This let's you change the name to anything you want and therefore avoid the name conflict. For the specific problem:
    <code>OtherFile.js</code>
    <pre><code>
import Car from './Car.js';
import { distance, power as powerMath } from '../MathHelper.js';
// CHANGES: Added an alias for power

// And to use it, you'll have to do:
//    powerMath()

// NOTE: You can also do:
//    import Fancy from '../Car.js';
// By default, all default imports are aliased. So you are not forced to import by the same name, but it is by convention to name this way.

function rentACar(money)
{
  // ... the same code ...
  return new Car();
}
    </code></pre>
  </p>
</details>

---

> Progress (4/6)

### Part 5: Diving Into React

> This will go over more in-depth on how to make a practical component in React. This one is a bit long, so be sure to take a break when you need to!

As per usual, skip the setup.

> NOTE: If you see `yarn`, it is just another package manager like `npm`. Most of the commands in `yarn` are the same as in `npm`, just replace `yarn` with `npm` and you should be fine. If that command doesn't exist, you can look up the equivalent command for `npm` on Google.

Useful questions:
- Why does the second code snippet (has 12 lines) extract `helloWorld` outside the render method? When do we NOT want to do this and why?
  - HINT: This has more to do with the philosophy of reusable design and code style than it does with React.
  - ANOTHER HINT: The tutorial only tells you why you should do it. It's up to you to figure out why we shouldn't do this EVERYWHERE. What if you have a huge render function? How about readability and flow of the file?

<details>
  <summary>Answer</summary>
  <p>There's no right answer as long as you have a logical reason for why you chose it. Maybe it was for readability? For managing complexity? For maintainability?</p>
</details>

- What is a Fragment? Why are they necessary?

<details>
  <summary>Answer</summary>
  <p>Since React render functions require you to have a single parent, if you need to return two sibling elements, you must put them under a single container. Fragments serve this purpose, like `&lt;div>`. They are like placeholders that will be removed later. However, why not use `&lt;div>`? Imagine you use a bunch of components that use `&lt;div>` as their parents. Then, the output will create a bunch of useless `&lt;div>` tags in the DOM tree. That becomes unmanageable and inefficient. Fragments will be removed when the component is added, so this complexity will be removed.</p>
</details>

- What is the difference between controlled and uncontrolled components?
  - Can you use them together?
  - How would you create a input field component that capitalizes the first letter of the entered text?
    - NOTE: Although both are legitimate methods to accomplish this task, by React's standards, we prefer to use controlled components when possible.

<details>
  <summary>Answer</summary>
  <p>Controlled components FORCE the element to use OUR state. Uncontrolled components are left to their own devices and we simply "ask" them for their state.</p>
  <p>But most importantly, THEY CANNOT BE USED TOGETHER! If you need to manipulate the data as it is changed, use controlled. Otherwise, let the default HTML logic handle it with uncontrolled.</p>
</details>

> Link: [Reusable Components in React - A Practical Guide](https://blog.bitsrc.io/reusable-components-in-react-a-practical-guide-ec15a81a4d71)

> Progress (5/6)

### Part 6: Actually Making Useful React Components
Congrats! You've made it to the last section of the tutorial. Now for the final stretch, we'll be working on one last hands-on tutorial... with minimal instructions. This is because the goal of this tutorial is not to teach you how to make ALL the useful components you will make, but how to make approach the design and the making of one. There are just way too many facets of front-end development to fit in even a month's worth of tutorials. Instead, I hope this tutorial can help you get started on this journey and smooth out that steep learning curve.

At the bottom are references to things that I think will be helpful for you. But before you crack them open, I would suggest you try looking things up on Google and see what you find. This is an essential skill to learn early.

However, there is one thing you should stay away from: copy-paste-able code. When you are researching for hours and you finally find something that solves your problem but it's like a hundred lines long, you are tempted to just copy-paste it over and be done with it. However, this is detrimental to both you and the project. For one, you lose the opportunity to learn how to actually solve the problem yourself. The next time you encounter the same problem, you will have to go on the search again. Also, for future readers of your code who are confused about how to work with it, you won't be able to answer and be stuck, once again, scouring the internet. It's best to understand what you are writing so that you can both learn and apply your software engineering skills to create maintainable and readable code.

(Of course, there are always exceptions. If you do copy-paste, ALWAYS put the link somewhere next to the code. That way, we can refer to it if something goes wrong. This goes also for research that inspired your work that you can't explain yourself.)

Now here's the specifications:

_Step 1:_

Use this as a template for the component to start off from (thank Jacob Chazen for making this happen).

```javascript
import React, { Component } from 'react';

// Be sure to create this file if it doesn't exist yet!
import './ItemList.css';

class ItemList extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      items: []
    };

    // You need to do something here for onButtonClick since it is being passed outside this context as an event handler... but what?
    // HINT: this.onButtonClick = ...
  }

  /** The */
  onButtonClick(e)
  {
    const target = e.target;

    // What do you want to do here?
    // HINT: You can access the id with target.id...
  }

  /** @override */
  render()
  {
    return (
      <article>
        <section className="list-container">
          <ul>
            {/* Put your list items here. */}
          </ul>
        </section>
        <div className="list-buttons">
          <button id="hat" onClick={this.onButtonClick}>Hat</button>
          <button id="bird" onClick={this.onButtonClick}>Bird</button>
          <button id="mushroom" onClick={this.onButtonClick}>Mushroom</button>
        </div>
      </article>
    );
  }
}

export default App;

```

Create an ItemList that displays a static list of items vertically. Just custom define any list for now. Just get something to show up.

HINT: Try a `<ul>` element. It contains `<li>` elements.

_Step 2:_

There should be a button that lets the user add either a "Hat", a "Bird", or a "Mushroom" to the growing list.

NOTE: The items are strings, not images.

HINT: [Display a List in React](https://daveceddia.com/display-a-list-in-react/)

HINT: The component should keep an array of strings. And the button, when clicked, should `push()` an item to that array. However, somehow you have to make sure that React knows it has been changed, otherwise, it will not be rendered.

_Step 3:_

There should be a button for each item that lets the user remove specific items already added into the list.

As the list changes, the order of the list should still be maintained.

NOTE: To keep the list order, just add new items to the end of the list. The rest should handle itself.

_Step 4:_

There should be a button that sorts the list. It only needs to sort the current list. In other words, it does not have to maintain sorted order afterwards, only at the moment of button click.

HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

NOTE: Did you declare any global variables (variables NOT restricted to the scope of the instance)? If so, it would still work for this example, but all variables that affect the state of the component should be kept within the instance. That means to define any variables in the constructor of the component class. Otherwise, any other instances of the same component will share the SAME variable and any manipulations would propagate to those components as well.

_Step 5:_

The Hat items, on hover, should change their background to `saddlebrown`.
The Bird item, on hover, should disappear.
The Mushroom item, on hover, should change colors.

HINT: You can style `<li>` tags with the `background` attribute to change color. To apply styles on hover, consider using a pseudo-class selector (such as `:hover`).

HINT: https://developer.mozilla.org/en-US/docs/Web/CSS/:hover

_Step 6:_

There should be a button that rotates the list to a horizontal view, where the first item is on the left and the last to the right.

HINT: Use CSS.
ANOTHER HINT: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
ALTERNATIVE HINT: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox

## More References

> Link: [Array Form Inputs](https://goshakkk.name/array-form-inputs/)
  - What to focus on:
  - Don't mutate the array, because it may not render properly.
  - So you gotta make a NEW array with filter, etc.

> Link: [Dynamically Add Classes](https://www.andreasreiterer.at/dynamically-add-classes/)

_Some videos about good stuff_
- Maps & Arrays: https://www.youtube.com/watch?v=Nzy5Qv-XQQQ
- Pure & Higher Order Funcs: https://www.youtube.com/watch?v=vNKxWqMbNpY

_Stuff that would be good to know, but not tested in this tutorial..._
- https://blog.pusher.com/beginners-guide-react-component-lifecycle/
- https://flaviocopes.com/react-forms/


## The Conclusion

And when you have done all that, I would say you are ready! If you run into any issues, feel free to message me. I'll be glad to clarify anything you were confused about or on any topics you want to know more about.

Happy Coding!
