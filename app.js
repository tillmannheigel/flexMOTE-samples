// minimal server for running reMOTE.jS sample applications
var express = require('express');
var app = express();
var http = require('http').Server(app);
var serveIndex = require('serve-index');
var compress = require('compression');

// config
app.use(compress());
app.use(express.static(__dirname + '/public'));
app.use(serveIndex(__dirname + '/public', {
    'icons': true
}));

// start
http.listen(3001, function() {
    console.log('listening on *:3001');
});
