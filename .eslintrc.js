module.exports = {
    "plugins": [
        "googleappsscript",
        "html"
    ],
    "env": {
        "googleappsscript/googleappsscript": true,
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015
    },
    "rules": {
        "curly": "error",
        "indent": [
            "error",
            2,
            {
                "SwitchCase": 1,
                "VariableDeclarator": "first"
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
