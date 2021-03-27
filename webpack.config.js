const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');
const webpack = require('webpack');

const config = async () => {
    const licenseText = 'goodtimer - https://github.com/nickpalenchar/goodtimer\n\n' +
        (await fs.promises.readFile(path.join(__dirname, 'LICENSE')));

    return {
        entry: './build/index.js',
        mode: 'production',
        output: {
            filename: `goodtimer-${packageJson.version}.js`,
            path: path.resolve(__dirname, 'build/browser/'),
            clean: true
        },
    }
}

module.exports = config();
