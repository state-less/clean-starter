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
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        'linebreak-style': 'off',
        'import/extensions': [
            1,
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
        'react/prop-types': 'off',
        'react/jsx-curly-newline': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        indent: 'off',
    },
};
