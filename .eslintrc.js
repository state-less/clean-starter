module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb', 'prettier', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'no-underscore-dangle': 'off',
        'no-restricted-syntax': 'off',
        'no-unused-expressions': 'off',
        'linebreak-style': 'off',
        'import/extensions': [
            'error',
            'never',
            {
                json: 'always',
            },
        ],
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/jsx-filename-extension': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': [0, 'first'],
        'react/require-default-props': 'off',
        'react/jsx-wrap-multilines': 'off',
        'no-use-before-define': 'off',
        'import/prefer-default-export': 'off',
        'react/react-in-jsx-scope': 'off',
        indent: 'off',
    },
};
