const path = require('path');

module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/react',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'allowImportExportEverywhere': true,
    },
    'plugins': [
        'react',
        'import',
        'jsx-a11y'
    ],
    'settings': {
        'react': { 'version': 'detect' },
        /** For import aliases (eslint-plugin-import-resolver-alias) */
        'import/resolver': {
            alias: {
                map: [
                    /** Add any aliases that need to be resolved by eslint here. Refer to webpack and jest config as well. */
                    // NOTE: This does not resolve for stylelint.
                    ['@flapjs', path.resolve(__dirname, 'src')]
                ]
            }
        }
    },
    'rules': {
        'indent': [
            'error',
            4,
            { "SwitchCase": 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],

        /** Our custom-defined rules... */

        /** Allman brace style (braces on new lines) is more readable. */
        'brace-style': [
            'error',
            'allman',
            { 'allowSingleLine': true }
        ],
        /**
         * We want an empty line at the end. This seems to be standard
         * in a lot of other style guides, so we have it too :P
         */
        'eol-last': [
            'error',
            'always'
        ],
        /**
         * This disables removing unused parameters from functions.
         * The reason is because knowing what parameters are expected
         * in a function can be a useful self-documenting feature.
         */
        'no-unused-vars': [
            'error',
            {
                'vars': 'all',
                'args': 'none'
            }
        ],
        /** Only allow JSX usage in these file types... */
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': ['jsx', 'spec.js', 'stories.js']
            }
        ],
        /** ES6 imports... */
        'import/no-absolute-path': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/no-self-import': 'error',
        'import/no-cycle': 'error',
        'import/no-useless-path-segments': 'error',
        'import/first': 'error',
        /** Enforces all imports to have file extensions... */
        'import/extensions': ['error', 'ignorePackages'],
        'import/no-unassigned-import': ['error', {
            // NOTE: If there is every a resource that you need
            // to import with no name, like global css files,
            // add it here.
            // NOTE: There is a caveat here where it should enforce
            // local CSS modules, but because it has the same file
            // extension as global CSS files, it can't be selected
            // by a glob pattern (negation patterns INCLUDE ALL files
            // don't match, rather than remove files that match).
            allow: [
                '**/*.css',
            ]
        }],
        // NOTE: This makes sure that dynamic imports are properly configured for webpack...
        'import/dynamic-import-chunkname': 'error',
    },
    'overrides': [
        {
            'files': [ '*.spec.js' ],
            'env': {
                'jest': true
            }
        },
        {
            'files': ['*.stories.js'],
            'env': {
                'node': true
            }
        }
    ]
};
