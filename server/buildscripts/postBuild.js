var jsonfile = require('jsonfile');
var util = require('util');

var file = '../dist/package.json';
jsonfile.readFile(file, function(err, obj) {
    delete obj.devDependencies;
    delete obj.private;

    jsonfile.writeFile("../dist/package.json", obj, {spaces:2}, function(err, obj) {
        if (err) {
            process.exit(1);
        }
    });
});

