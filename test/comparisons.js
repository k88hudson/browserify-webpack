var fs = require('fs-extra');
var path = require('path');
var async = require('async')
var exec = require('child_process').exec;
var colors = require('colors');
var Handlebars = require('handlebars');


describe('Browserify vs Webpack', function() {

    this.timeout(0);

    // Paths
    var RESULTS_DIR = path.join(__dirname, 'results');
    var webpackConfig = path.join(__dirname, 'webpack.test.js');

    // browser testing
    var templateSource = '<html><head></head><body><script src="{{src}}"></script></body></html>';
    var template = Handlebars.compile(templateSource);

    // Files!
    var files = [
        {
            filename: 'just-react.js',
            description: 'Single react require.'
        },
        {
            filename: 'react-with-addons.js',
            description: 'React with addons.'
        },
        {
            filename: 'react-with-router-firebase.js',
            description: 'React with addons, react-router, and firebase.'
        },
        {
            filename: 'wm-deps.js',
            description: 'Complete wm.app dependency tree'
        }
    ].map( (test) => {
        test.srcFile = path.join(__dirname, 'fixtures', test.filename);
        return test;
    });

    it('production', function (done) {

        var destFolder = path.join(RESULTS_DIR, 'prod');
        fs.ensureDirSync(destFolder);

        async.each(files,
            function (test, callback) {
                var filename = test.filename;
                var srcFile = test.srcFile;
                var destPath = {
                    b: path.join(destFolder, `${filename}.browserify.js`),
                    w: path.join(destFolder, `${filename}.webpack.js`)
                };
                var command = `browserify -e ${srcFile} -t [reactify --es6 --target es5] | uglifyjs --compress --mangle > ${destPath.b}` +
                `&& webpack ${srcFile} ${destPath.w} -p --config ${webpackConfig}`;
                exec(command, function (err) {
                    if (err) return callback(err);

                    // Write test files
                    fs.writeFileSync(path.join(destFolder, `${filename}.browserify.html`), template({src: `${filename}.browserify.js`}));
                    fs.writeFileSync(path.join(destFolder, `${filename}.webpack.html`), template({src: `${filename}.webpack.js`}));

                    // Output results
                    var sizeB = fs.statSync(destPath.b).size/1000;
                    var sizeW = fs.statSync(destPath.w).size/1000;
                    var sizeDiffPercent = Math.round((sizeB/sizeW - 1) * 100);
                    var sizeDiffKb = Math.round(sizeB - sizeW);
                    var testr = `==============\n`.grey +
                                `${test.description}\n` +
                                `==============\n`.grey +
                                `BROWSERIFY ${sizeB}kb\n`.red +
                                `WEBPACK    ${sizeW}kb\n`.green +
                                `( Diff: ${sizeDiffPercent}%, or ${sizeDiffKb}kb )\n\n`;
                    console.log(testr);
                    callback();
                });
            }, done);
        });
});

