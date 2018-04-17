/**
 * Created by xiaochen on 4/17/18.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var port = 8585;
var app = express();
var server = http.createServer(app);


app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Need to extend
app.post('/photo', function (req, res) {
    console.log(req.body);
    res.send(req.body);
});

server.listen(port);
console.log('Sever Started');
