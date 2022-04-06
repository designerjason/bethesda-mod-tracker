const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/assets/scripts/modscript.js',
    output: {
        filename: 'modscript.min.js',
        path: path.resolve(__dirname, 'docs/assets/scripts')
    }
};
