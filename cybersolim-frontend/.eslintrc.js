// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
      'plugin:vue/essential',
      'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'html',
        'vue'
    ],
    // add your custom rules here
    // off 0; warn 1; error 2
    'rules': {
        "indent": [0, 4],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "eol-last": [0, "always"],
        "space-before-function-paren": [0, "always"], //函数定义时括号前面要不要有空格
        "semi": [0, "always"], //分号
        "object-property-newline": 0,
        "no-new": 0,
        "no-unused-vars": 1,
        "no-trailing-spaces": 1
    }
}
