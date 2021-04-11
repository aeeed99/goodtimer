const path = require('path');
const packageJson = require('./package.json');

const config = async () => ({
        entry: './build/node/index.js',
        mode: 'production',
        output: {
            filename: `goodtimer-${packageJson.version}.js`,
            path: path.resolve(__dirname, 'build/browser/'),
            clean: true
        },
});

module.exports = config();
