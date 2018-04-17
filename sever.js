/**
 * Created by xiaochen on 4/17/18.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var port = 80;
var app = express();
var server = http.createServer(app);


app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/photo', function (req, res) {
    console.log(req.body);
    res.send(req.body);
});

server.listen(port);

// http.createServer(function (req, res) {
//     res.writeHeader(200, {'Content-Type': 'text/plain'});
//     res.end('Server is working now');
// }).listen(port);

console.log('Sever Started');
