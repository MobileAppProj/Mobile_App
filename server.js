var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var base64Img = require('base64-img');

var port = 8585;
var app = express();

// Clarifai API Related
var server = http.createServer(app);
const Clarifai = require('clarifai');
const faiApp = new Clarifai.App({
       apiKey: 'fdf54109d2704294a5861bd7387bfbdf'
 });

// For Front-end Connect
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

var text = '{ "code": 0, "err": " ","data": {"Apple": "information", "Orange": "information"}, "string": "Hello World"}';
var json = JSON.parse(text);

var image = base64Img.base64Sync('/Users/xiaochen/Desktop/Course/49788 Mobile Apps/team/Mobile_App/test.jpg');
var degital = image.split(',')[1].toString();

// Need to extend
app.post('/photo', function (req, res) {
    // Use for latter test
    // image = req.photo;
    // degital = base64Img.base64Sync(image).split(',')[1].toString();

    res.setHeader('Content-Type', 'application/json');
    console.log("There is a new request");
    faiApp.models.predict(Clarifai.GENERAL_MODEL, {base64: degital}).then(
        function(response) {
            var foods = response.outputs[0].data.concepts;
            for (var i = 0; i < foods.length; i++) {
                var name = foods[i].name;
                var accuracy = foods[i].value;
                if (accuracy < 0.9) continue;

                /* Implement Query Part here
                *  Once Get Food name, query in DB to get more information
                */
                console.log(name);
            }
            res.send(JSON.stringify(response));
        },
        function(err) {
            console.error(err);
            res.send(JSON.stringify(err));
        }
    );
    // Send Back

    res.send(json);
});

server.listen(port);
console.log('Server Started');
