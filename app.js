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
    console.log("flextMOTE Server: " + server + ":" + port);

    // config
    app.use(compress());
    app.use(express.static(__dirname + '/public'));
    app.use(serveIndex(__dirname + '/public', {
        'icons': true
    }));

    // start
    http.listen(3001, function() {
        console.log('flexmote.js - samples; listening on *:3001');
    });

}

function printHelpMessage(){
    process.stdout.write(`flexMOTE Usage: node app.js [arguments]

    ARGUMENTS
    \t-h, --help\t print this help message
    \t-s, --server\t set the ip address of the flexMOTE server [default: 127.0.0.1]
    \t-p, --port\t set the port of the flexMOTE server [default: 3000]
    `+"\n");
};
