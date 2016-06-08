// minimal server for running reMOTE.jS sample applications
var express = require('express');
var app = express();
var http = require('http').Server(app);
var serveIndex = require('serve-index');
var compress = require('compression');
var minimist = require('minimist');

// check args
var args = minimist(process.argv.slice(2));

if(args["h"] || args["help"]) {

    printHelpMessage();

} else {

    //regular server start
    var server = args["s"] || args ["server"] || "localhost"
    var port = args["p"] || args ["port"] || "3000"
    var localport = args["l"] || args ["localport"] || 3001

    // config
    app.use(compress());
    app.use(express.static(__dirname + '/public'));
    app.use(serveIndex(__dirname + '/public', {
        'icons': true
    }));

    // start
    http.listen(localport, function() {
        process.stdout.write(`flexMOTE.js - samples
            ...client: listening to *:` + localport + `
            ...server: requesting to `  + server + `:` + port +"\n");
    });

}

function printHelpMessage(){
    process.stdout.write(`flexMOTE Usage: node app.js [arguments]

    ARGUMENTS
    \t-h, --help\t print this help message
    \t-l, --localport\t set the port of the flexMOTE client instance [default: 3001]
    \t-p, --port\t set the port of the flexMOTE server [default: 3000]
    \t-s, --server\t set the ip address of the flexMOTE server [default: 127.0.0.1]
    `+"\n");
};
