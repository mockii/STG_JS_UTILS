#! /usr/bin/env node

var fs = require('fs'),
    semver = require('semver'),
    prompt = require('prompt'),
    fsSync = require('fs-sync'),
    execSync = require('sync-exec');

var setupPromptSchema = {
    properties: {
        projectName: {
            description: "Project Name:",
            type: "string",
            default: "stgNgTest",
            required: true
        },
        projectVersion: {
            description: "Version:",
            type: "string",
            default: "1.0.0",
            required: true,
            conform: function(data) {
                return semver.valid(data);
            }
        }
    }
};

prompt.start();
prompt.message = "";
prompt.delimiter = "";

//
// Get two properties from the user: username and email
//
prompt.get(setupPromptSchema, function (err, result) {

    if (err) {
        process.exit(1);
    }

    // create line break
    console.log('\nSetting up project:');

    createPackage(result.projectName, result.projectVersion);
});

function createPackage(projectName, projectVersion) {
    console.log("creating folders");
    mkdirSync("./client");
    mkdirSync("./server");

    console.log("creating package.json files");
    createPackageJSON("client", projectName, projectVersion);
    createPackageJSON("server", projectName, projectVersion);

    console.log("building client directory");
    mkdirSync("./client/test");
    mkdirSync("./client/vendor");
    mkdirSync("./client/src");
    copyFile(__dirname + "/lib/client/src", "./client/src");
    mkdirSync("./client/src/assets/fonts");
    mkdirSync("./client/src/assets/icons");
    copyFile(__dirname + "/lib/client/env", "./client/env");
    copyFile(__dirname + "/lib/.jazzignore", "./client/.jazzignore");
    copyFile(__dirname + "/lib/client/.jshintignore", "./client/.jshintignore");
    copyFile(__dirname + "/lib/client/.jshintrc", "./client/.jshintrc");
    copyFile(__dirname + "/lib/client/.npmrc", "./client/.npmrc");
    copyFile(__dirname + "/lib/client/gruntfile.js", "./client/gruntfile.js");

    editAppJS(projectName);
    editIndexHTML(projectName);
    npmInstallClient();


    console.log("\nbuilding server directory");
    copyFile(__dirname + "/lib/server/src", "./server/src");
    editServerIndexJS(projectName);
    copyFile(__dirname + "/lib/server/.npmrc", "./server/.npmrc");
    copyFile(__dirname + "/lib/server/gruntfile.js", "./server/gruntfile.js");
    copyFile(__dirname + "/lib/.jazzignore", "./server/.jazzignore");
    npmInstallServer();

    copyFile(__dirname + "/lib/.jazzignore", "./.jazzignore");
}

function npmInstallServer() {
    process.stdout.write("      .. running NPM install: ");
    var installResponse = execSync('cd server/ && npm install');
    if (installResponse.stderr.length > 0) {
        process.stdout.write("error!\n" + installResponse.stderr + "\n");
    } else {
        process.stdout.write("done\n");
    }
}

function npmInstallClient() {
    process.stdout.write("      .. running NPM install: ");
    var installResponse = execSync('cd client/ && npm install');
    if (installResponse.stderr.length > 0) {
        process.stdout.write("error!\n" + installResponse.stderr + "\n");
    } else {
        process.stdout.write("done\n");
    }
}

function editServerIndexJS(projectName) {
    process.stdout.write("      .. editing index.js file.. ");
    var fileContents = fsSync.read("./server/src/index.js");
    fileContents = fileContents.replace(/%app%/g, projectName);
    fsSync.write("./server/src/index.js", fileContents);
    process.stdout.write("done\n");
}

function editAppJS(projectName) {
    process.stdout.write("      .. editing app.js file.. ");
    var fileContents = fsSync.read("./client/src/app/app.js");
    fileContents = fileContents.replace(/%app%/g, projectName);
    fsSync.write("./client/src/app/app.js", fileContents);
    process.stdout.write("done\n");
}

function editIndexHTML(projectName) {
    process.stdout.write("      .. editing index.html file.. ");
    var fileContents = fsSync.read("./client/src/index.html");
    fileContents = fileContents.replace(/%app%/g, projectName);
    fsSync.write("./client/src/index.html", fileContents);
    process.stdout.write("done\n");
}

function createPackageJSON(jsonType, projectName, projectVersion) {
    var packageLocation = (jsonType.toLowerCase() === "client" ? "/client" : "/server");
    process.stdout.write("      .." + packageLocation + "/package.json: ");

    var filePath = __dirname + "/lib" + packageLocation + "/package.json.tpl";
    var basePackageData = fsSync.readJSON(filePath);
    var myData = {
        name: projectName + "-" + jsonType.toLowerCase(),
        version: projectVersion
    };

    Object.keys(basePackageData).forEach(function(key) {
        myData[key] = basePackageData[key];
    });

    var formattedData = JSON.stringify(myData, null, 2) + "\n";

    fsSync.write("." + packageLocation + "/package.json", formattedData, 'utf8', function(err) {
        if (err) {
            console.log(err);
        }
    });

    process.stdout.write("done\n");
}



var mkdirSync = function (path) {
    try {
        process.stdout.write("      ." + path + ": ");
        fs.mkdirSync(path);
        process.stdout.write("done");
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    } finally {
        process.stdout.write("\n");
    }
};

function copyFile(source, target, cb) {
    process.stdout.write("      .. Copying to " + target + ": ");
    fsSync.copy(source, target);
    process.stdout.write("done\n");
}
