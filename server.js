/**
 * Created by xiaochen on 4/17/18.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var port = 8585;
var app = express();
var server = http.createServer(app);

var text = "{code:0, errMsg:'',data:{'Apple': {information}, 'Orange': {information}}}";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Need to extend
app.post('/photo', function (req, res) {
    console.log(req.body);
    res.send(text);
});

server.listen(port);
console.log('Server Started');
