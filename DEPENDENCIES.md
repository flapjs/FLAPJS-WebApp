# Tools

# What is this for?
To make sure any future contributor can update the tools we use, we must show our reasoning for each toolset, plugin, language, etc. that we chose. Therefore, for any tools you decide to add to the project, be sure to also include below your reasoning why you chose it, why it is better than other alternatives, what would be better, and how to update/change it.

## react
- This is a component UI library that enables us to structure our components in a manner that is easy to read and understand. (It is also because of legacy code.) We could have also used Web Components, although a steeper learning curve, is guaranteed to be future proof by web standards.

## webpack
- This allows us to bundle and transform our source code to something more efficient and compact for delivery. Although other alternatives exist, such as `rollup` or `parcel`, `webpack` is built for SPAs (single page applications) in mind. Things such as automatic code-splitting, which breaks-up our LARGE bundle into smaller chunks reducing immediate load time, and easier static asset organization.
- If we are no longer using these features, `rollup` is a great alternative. I will leave the research to you. Here's something to get you started.
- https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c
- _CONFIG:_ `webpack.config.js`, `.webpack/*`

## webpack-cli
- We need this to interact with `webpack` in the command line.

## webpack-dev-server
- This allows us to use `hot module reloading` to live-reload code changes, which is very helpful when debugging.
- Do be careful when adding other loaders for different files. If you expect these files to also be hot-reloaded, you need to also find compatible loaders.

## react-hot-loader - NOT USED
- Since we are using React and HMR, there is a point to be made to include `react-hot-loader`. However, it is quite difficult to setup CORRECTLY and is still not stable (there are also concerns that it encourages monkey-patching style of coding, which results in bad testing and documentation). Until the plugin can play nicely with all other plugins, we should be cautious about including it in the project. Currently, we do NOT use it.

## webpack-merge
- This supports the separation of Webpack configurations for development and production builds into different files by allowing the config files to "merge" with other common config files. This reduces redundancy and actually makes separating the config files a reasonable approach to different build options.
- The only other alternative is to keep both configurations in the same file, but this would soon lead to a massive file that is hard to read.
- Here's a tutorial on how we did it.
- https://dev.to/wiaio/how-to-set-up-different-webpack-configurations-for-development-and-production-2bk9

## css-loader
- This allows us to use `import` with css files, which also allows `webpack`, and its related plugins and functions, to manage them.
- This also allows CSS to be styled locally to a component, resolving global namespace conflicts and other issues with global stylesheets. How it achieves this is by replacing the class names with a uniquely generated hash for each comopnent's stylesheet. Therefore, the style is still loaded globally, but the namespaces will never conflict.

## style-loader - NOT USED
- This is usually used in-tandem with `css-loader` for loading stylesheets. However, `mini-css-extract-plugin` already has this implemented and therefore makes this obsolete. Currently, because we use `mini-css-extract-plugin`, we do NOT use this.

> **SETUP:**
This increases the `importLoaders` property of `css-loader` by 1.

## file-loader
- This is used to load any asset files, such as images, languages, etc. This can also be used with dynamic imports to dynamically load resources.
- For dynamic importing for assets, check this out: https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234

> **SETUP:**
Add it to the list of loaders in the webpack config and be sure to match the correct file extension for every type of asset.

## babel
- This allows us to transpile our source code to other web versions to support older browsers. The reason we chose this is because no other package is as widely supported nor as well-documented as this one.
- To configure this, it has a config file called `.babelrc`. Sometimes, when reading related documentation on Babel, it tells you to put the options and other properties in the webpack config file itself. This is generally bad practice and you should try to always put it in `.babelrc`, unless it is not feasible (which then means you are doing something extremely unstable and hacky).
- _CONFIG:_ `.babelrc`

## babel/preset-env
- This is the default ES5 specs for Babel to recognize and transform.

> **SETUP:**
It is added to the presets list in `.babelrc`.

## babel/preset-react
- This is the React specs for Babel to recognize and transform.

> **SETUP:**
It is added to the presets list in `.babelrc`.

## babel-eslint
- This adds support for babel transforms in eslint. This is basically only used to stop eslint from picking on dynamic import statements.

> **SETUP:**
'babel-eslint' is added as a 'parser' property in `.eslintrc.js`. Then the 'allowImportExportEverywhere' is set to true under 'parserOptions'. And that is it!

## babel-plugin-react-css-module - NOT USED
- This is usually used for CSS modules, but css-loader already takes care of this. And this plugin also has a few bugs that are probably never getting fixed. So this information is just here for posterity's sake.
- The reason we don't use `react-css-modules`, which serves the same purpose as this one, is because it has a limitation where all classNames must be camelCase. This Babel plugin allows us to use dash-case names, just as you would expect by convention for CSS.
- It is dependent upon `css-loader` and `style-loader` (replaced by `mini-css-extract-plugin`).
- There is one issue however: it does inject a runtime function for resolving unidentifiable CSS class names (therefore it is a production dependency). Although this is not good for bloat, albeit minimal, it is really small and almost negligible in performance. But this is important to keep in mind when considering newer tools.
- One more important thing to note: this is not the same as CSS-in-JS or inline styles, and is actually better than those alternatives. Here's why.
    - Both inline styles and CSS-in-JS forces styles to live within the component as JavaScript objects.
        - Firstly, for inline styles, this is poor for performance as the browser must evaluate your JavaScript before a style could be computed. We want it to load everything as fast as possible, removing dependency bottlenecks. CSS-in-JS circumvents this by attaching style tags to the head instead of loading them from script tags. Although this is an agreeable solution, it does not satisfy the next issue.
        - Secondly, there should be a separation of concerns for style and logic/semantics. Style should have nothing to do with how the component functions and should be interchangeable, like themes. If I were to build another component, I will likely want to use the same stylesheet for the style, and if it is within a component class, I would begin using the ENTIRE component class for their style. This is a bad design pattern, because modularity is violated. It allows bad import practices.
- https://github.com/gajus/babel-plugin-react-css-modules

> **NOTICE:**:
There is currently an issue where if you try to add an undeclared style class name in JavaScript, then create it afterwards in CSS, it will not update correctly. To resolve this, re-save the JavaScript file. There is an open issue pertaining to this problem:
https://github.com/gajus/babel-plugin-react-css-modules/issues/200

## mini-css-extract-plugin
- This extracts all CSS to a single css file OUTSIDE of the JavaScript bundle. Otherwise, the extra care to separate style and JavaScript loading would gain no loading time benefits.
- There exists another similar plugin `extract-text-webpack-plugin`, but it is no longer supported past webpack v4.
- This increases the `importLoaders` property of `css-loader` by 1.

> **SETUP**:
This is only really useful in production mode. However, to remain consistent with the production environment, we include it in the development mode. This will break HMR mode for webpack-dev-server, so we set `hmr: true` in the loader options for the dev build. Also, `MiniCSSExtractPlugin.loader` replaces `style-loader`, as stated by their own documentation. Therefore, we no longer need `style-loader` if you use this.

## classnames - NOT USED
- You may find yourself wanting to simplify the string concatenation chain of conditional class names. This utility takes an object that maps each class name to an evaluated value, truthy as included and vice versa. Although it seems to solve the problem, it does create a little overhead for every render step. Vanilla string concat is the most efficient way without incurring more object creation time every render. Weighing both the benefits and the cost, including  setup costs, it may not be as useful. Though if it really does bother you, try it out.
- https://github.com/JedWatson/classnames

## postcss-loader
- Allows us to process CSS. It is really just included because `autoprefixer` requires it.
- This increases the `importLoaders` property of `css-loader` by 1.
- _CONFIG:_ `postcss.config.js`

## autoprefixer
- This way, we don't need to write `-moz-`, `-webkit-`, etc. for all vendor specific features. Just use the common base name and this plugin will generate the appropriate prefixes.
- _DEPENDENCY:_ This is dependent on `postcss-loader`.
- The prefixes are determined by: https://caniuse.com/
- https://github.com/postcss/autoprefixer

> **SETUP:**
Add the plugin to `postcss.config.js` under plugins.

## storybook
- Let's you document and test every component visually. Not only does it provide a visual documentation of each component in a "story" environment, sort of like a use case, it also functions as a playground of features.
- Any Storybook-related configuration lives in `.storybook`. Storybook has their own `config.js` file, but they also have their own webpack config file. This should generally be the same as the project development build, but there are some difference in order to make it work (this is further explained in the file itself).
- _CONFIG:_ `.storybook/*`
- https://blog.bam.tech/developper-news/use-storybook-react-project
- https://www.learnstorybook.com/react/en/simple-component/

## storybook/react
- This adds support for React in Storybook. No other setup is required other than installation (it does require React...).

## storybook/addon-knobs
- Let's you change the values of the component in realtime with sliders, text fields, etc. This way we can actually build a component playground for developers to try things out.

## babel-plugin-require-context-hook
- Allows Storybook stories to be searchable within the source directories by prepping the executed context to the directory it lives in.

> **SETUP:**
This is only used in the `test` environment in `.babelrc` and in the config file for Storybook.

## html-webpack-plugin
- Automatically injects bundled scripts and resources into HTML with appropriate tags.
- Since the HTML is now generated, it requires we specify a template. This is stored in `./src/assets/template.html`. You can change the template in the webpack config file.
- https://github.com/jantimon/html-webpack-plugin

## html-webpack-inline-source-only-plugin
- Allows script (and link) tags to be inlined into the HTML file. This is only used for a couple of specific globally scoped scripts. Other scripts, particularly those larger, should be bundled and loaded asynchronously (through `src` or `href` attributes).
- I wrote this one... So feel free to find something better.
- _DEPENDENCY:_ Requires `html-webpack-plugin`.

> **NOTE:** There exists other plugins that claim to do the same thing, such as `html-inline-source-webpack-plugin`, `script-ext-html-webpack-plugin`, and `html-webpack-source-inline-plugin`. However, all inlined scripts would just be injected with all other scripts in random order. None of them support html templates as defined by `html-webpack-plugin`. Therefore, we've actually implemented our own plugin that does just what we want :D This is probably why you don't see this in `package.json`, because we wrote it ourselves. It currently lives in `tools`.

> **SETUP:**
The plugin is added to `webpack`, under `plugins`. Refer to their documentation for more information.

> **USAGE:**
Any script or link tag with the `inline` attribute in the generated HTML page by `html-webpack-plugin` will be inlined. Simple as that.

## clean-webpack-plugin
- Removes unused files from Webpack in the output directory.

## copy-webpack-plugin
- Copies static resource files to the build folder.
- https://github.com/webpack-contrib/copy-webpack-plugin

> **SETUP:**
The plugin is added to `webpack`, under `plugins`. Refer to their documentation for more information.

> **USAGE:**
When you want to add any additional resources to be copied, just add it to the plugin options in the `webpack` config file.

## workbox-webpack-plugin
- Helps us to easily setup a service worker. In the past, this use to be a custom script that we would maintain ourselves. However, due to the increasing complexity, using a library to manage our service worker would simplify onboarding and sustain maintainability.
- https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin

> **SETUP:**
The plugin is added to `webpack`, under `plugins`. Any other service worker configurations, outside of `webpack` related options, would be in the injected service worker file defined by the `swSrc` option in the plugin init.

> **NOTE:**
If you ever need to manage or change how a file is cached while offline, which by default is network-first strategy, you must add your own configuration to the bottom of the service worker file. This does not refer to the generated service worker file, but rather the source it is generated from. Please refer to the plugin docs for more details.

> **NOTE:**
Service workers are a massive undertaking for new developers. Please take your time and don't plan to fully understand what is going one the first few days working with it. I suggest you try it out in a smaller project and follow some tutorials before committing any changes here. I myself still don't completely understand how certain parts work. With that out of the way, in order for browsers to recognize that the app is a service worker app that can be installed, it must define a `*.webmanifest` file (as defined by specification). Within is just data describing the app, similar to Android or iOS app manifest files. Service workers also must be manually installed in the `index.html`. And after installation and cache strategy setup, now we must maintain and manage data and code consistency. Basically, since we are caching different versions of the project WHILE it is being used, the code or data may conflict with old and new versions if certain versions are not properly loaded or unloaded. In other words, we must make sure that we load the newest code when possible, such as when online, and use an old but consistent version when offline. We can achieve this several ways, but primarily we should ask the user to refresh and update and not automatically force them to do it (this is more human-centered design). Therefore, we should have a prompt that asks the user to refresh when a new version is found when online. Beyond that, you should refer to other articles about modern practices with service workers as it is, as of the time of this writing, still relatively new. Things may have changed since I've added it.

## jest
- Allows us to perform unit tests. Unlike other testing frameworks, this allows us to take snapshots of React components and diff them over time.
- _DEPENDENCY:_ Requires `babel-jest` if using `babel`.
- _CONFIG:_ `.jest/*`

> **NOTICE:**
Since Jest requires a couple files, including config and setup files, these files are kept under the `.jest` directory. Because of this, running Jest will always require `--config` to point to the config file under the directory. To simplify this, there is a npm command that calls this for you: `npm run jest`.

> **USAGE: Unit Testing**
Files that match `*.spec.js` or `*.test.js` are all automatically found and processed by Jest as unit tests (if any of these files should NOT be processed, update the config file to ignore them). Therefore, test files can be placed directly next to the other files they test. Also, when running Jest tests, it will always run the setup file FIRST to import required libraries or globals before running any tests. Globals can be defined through `global`, for example: `global.React = React;`, however this is generally not good practice and would cause the linters to mark them as unused variables. After running, it will print to console (or force exit if using `--bail`) the results.

> **USAGE: Snapshot Testing**
Although the above is sufficient for unit tests, snapshot testing requires an extra step. To take a snapshot, use `expect(...).toMatchSnapshot()`. And every subsequent Jest run will diff the results between the FIRST snapshot and the current one. If they differ, this will throw an error. This allows us to recognize when the DOM tree changes due to our own changes. If the changes are expected, we must tell Jest to update the snapshots using `--updateSnapshot` (this is also handily provided as an npm command: `npm run jest-update`).

> **NOTE:**
File resolution for jest tests is also a problem. Currently CSS modules are resolved by `identity-obj-proxy`, but for the future and other file types, this is definitely an issue.

> **NOTE:**
Jest tests using mount or shallow do not support using ref. You must either use createNodeMock() provided by React, or some other solution. In addition to changing the specifc test, you also need to add an exception to Storybook for that component as well.

## jest-fetch-mock
- This allows us to mock and test fetch() calls.

> **SETUP:**
There is setup code to put in the `setup.js` file for Jest. This is simply to declare a global mock of the fetch() function, so it becomes accessible even in the node environment, and provide default mocked data for any fetch calls.

## babel-jest
- Allows Babel to recognize Jest tests. Otherwise, Jest cannot use Babel transformations, such as CSS modules.

> **NOTICE:**
With this, we can disable CSS modules for Jest tests. That means CSS class names (or style names) will be un-transformed, but also these names will conflict with other components. However, this is fine because the styles are never actually loaded for testing, only checked for existance by Jest tests. For pixel matching and related tests, it would be best to use an actual end-to-end testing framework instead.

> **SETUP:**
- This is only used in the `test` environment in `.babelrc`.

## identity-obj-proxy
- Allows Jest to resolve CSS imports.
- It can be used in many places, but it is currently only used by `jest`.

> **SETUP:**
- It also includes some setup code for Jest that must run before any tests. This is usually put in the tests setup file in `.jest`.

## enzyme
- Allows easier React testing.
- _DEPENDENCY:_ Requires `enzyme-adapter-react-16` to work with React v16.
- _DEPENDENCY:_ Requires `enzyme-to-json` to work with Jest snapshot testing.

## enzyme-adapter-react-16
- Adds support for React v16 to Enzyme.

## enzyme-to-json
- Allows Enzyme to be used for Jest snapshots by converting Enzyme wrappers for the snapshot matcher.
- In addition to general Jest snapshot testing, it is also used by `storybook/addon-storyshots`.

> **SETUP:**
To use it, add it to snapshotSerializers array in Jest config file.

## storybook/addon-storyshots
- Allows automatic test snapshots for every Storybook story. This does require its own `.spec.js` file to be executed by Jest (which currently lives in `src/tests`).

## prop-types
- Allows prop type checking for React component.

## husky
- Allows tests to run before commits and pushes. This is basically a simplified way to register git pre-commit hooks.
- _CONFIG:_ `.huskyrc`

## eslint
### Which Style Guide?
- Since we use React, we should probably not use Google's style guide.
- There is a VS Code plugin for auto-checking eslint while coding.
- _CONFIG:_ `.eslintrc.js`, `.eslintignore`
- https://medium.com/@uistephen/style-guides-for-linting-ecmascript-2015-eslint-common-google-airbnb-6c25fd3dff0

## eslint-plugin-react
- To support React linting.
- It is also added to the addons list in `.storybook/addons.js`.

## eslint-loader
- Runs linter before every build.

## eslint-plugin-import
- Catches ES6 import lint errors.

## eslint-import-resolver-alias
- Allows aliases to be defined for the import plugin.

> **USAGE: Adding an alias**
If you want to add an alias (for ES6 imports), you will need to add the alias to 3 different config files: webpack, jest, and eslint. For webpack, append the alias under `resolve.alias` with its evaluated result as its value. For jest, append the alias under `moduleNameMapper` as a regex-to-string entry. As an example, the key could look something like `^@App(.*)$` and the value like `<rootDir>/src/app$1`. For eslint, append the alias entry under `settings['import/resolver'].alias.map` as an array with the first element as the alias and the second the result.

> **NOTE:**
This does not include stylelint.

## eslint-plugin-jsx-a11y
- Catches accessibility lint errors. Does not catch ALL of them though. Further testing is required.

## stylelint 
- Catches CSS style lint errors.
- There is a VS Code plugin for auto-checking stylelint while coding.
- _NOTE:_ We do enforce no empty files because there should at least be a comment to explain why it is empty. Otherwise, it could be an accident.
- _CONFIG:_ `.stylelintrc.js`, `.stylelintignore`

## stylelint-config-standard
- This is the standard style guide for stylelint.

## lint-staged
- Allows tests and lints to process only staged files, instead of the whole code base for every commit.
- This is used alongside `husky`.
- _CONFIG:_ `.lintstagedrc`
- https://benmccormick.org/2017/02/26/running-jest-tests-before-each-git-commit/

> **USAGE:**
Any commands ran by this are specified in its config file. The key is a glob pattern matching the files to process, and the value is an array of commands to run in sequence. The filtered files will be passed to the commands as the last argument.

## travic-ci
- Allows our project to run scripts automatically for each push, thereby supporting continuous integration.
- Currently, it only runs `npm test`. Perhaps in the future, it should automatically construct a production build, including updating version number, changelog, docs, etc.
- _CONFIG:_ `.travis.yml`
- https://docs.travis-ci.com/user/deployment/pages/

## cypress
- Allows end-to-end testing in Chrome and other browsers.
- _CONFIG:_ `cypress.json`, `cypress/*`

## eslint-plugin-cypress
- Enables eslint to properly lint cypress tests.

> **SETUP:**
- It requires its own eslint config file for the `cypress` directory. Refer to `eslint-plugin-cypress` docs for the required contents (we do use their recommended style guide).

## @svgr/webpack
- This allows auto-transform of SVG files at bundle-time to React components. This way we don't have to write another React component for EVERY SVG file. It also auto-optimizes the svg for us, so WOO!

> **SETUP:**
Like all file type handling, we add an entry for SVGs in the webpack loader section. You can also specify additional options there. Here's a table of those:

https://www.smooth-code.com/open-source/svgr/docs/options/
