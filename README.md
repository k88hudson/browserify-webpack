This is **not** a general-purpose argument about whether browserify or webpack is better, but rather some reduced test cases that are useful specific to the Webmaker App project. https://github.com/mozilla/webmaker-app.

## What I'm testing

### Production optimization

For production, my goal was to perform as many optimizations as possible to reduce the final bundle size.

#### Browserify
```bash
browserify -e ${srcFile} -t [reactify --es6 --target es5] | uglifyjs -c ${compressorString} --mangle > ${destFile}
```
Compressor options:
```js
{
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
}
```

#### Webpack
```
webpack ${srcFile} ${destFile} -p --config ${webpackConfig}`
```

#### Results
```
==============
Single react require.
==============
BROWSERIFY 167.899kb
WEBPACK    150.335kb
( Diff: 12%, or 18kb )


==============
React with addons.
==============
BROWSERIFY 184.758kb
WEBPACK    165.329kb
( Diff: 12%, or 19kb )


==============
React with addons, react-router, and firebase.
==============
BROWSERIFY 367.012kb
WEBPACK    341.378kb
( Diff: 8%, or 26kb )


==============
Complete wm.app dependency tree
==============
BROWSERIFY 574.526kb
WEBPACK    494.073kb
( Diff: 16%, or 80kb )
```
