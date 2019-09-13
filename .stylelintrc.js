/* eslint-env node */

module.exports = {
    'extends': 'stylelint-config-standard',
    'rules': {
        'indentation': 4,
        'color-hex-case': 'upper',
        'color-hex-length': 'long',
        'function-calc-no-unspaced-operator': true,
        'property-no-vendor-prefix': true,
        'string-quotes': 'single',
        /** Add support for some CSS module features */
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: [
                    'global',
                    'local',
                ],
            },
        ],
        'property-no-unknown': [
            true,
            {
                ignoreProperties: [
                    'composes'
                ],
            },
        ],
        'selector-type-no-unknown': [
            true,
            {
                ignoreTypes: [
                    'from'
                ],
            },
        ],
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'value'
                ],
            },
        ],
    }
};
