var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var base64Img = require('base64-img');
var mysql = require('mysql');

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

//Mysql Connection
var connection = mysql.createConnection({
    host : 'mysql.chugopmntol2.us-east-1.rds.amazonaws.com',
    user : 'root',
    password : '1993714cx',
    database : 'canguan'
});

connection.connect();
console.log("Successful connect to Database");


var query  = 'SELECT * FROM canguan.restaurants WHERE contents LIKE \'%sandwich%\';';
connection.query(query, function (error, results, field) {
    if (error) throw error;
    var out = {'out' : results[0]};
    console.log(JSON.stringify(out));
    console.log(typeof(out));
});


app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

var text = '{ "code": 0, "err": " ","data": {"Apple": "information", "Orange": "information"}, "string": "Hello World"}';
var json = JSON.parse(text);

var image = base64Img.base64Sync('/Users/xiaochen/Desktop/Course/49788 Mobile Apps/team/Mobile_App/test.jpg');
var degital = image.split(',')[1].toString();

var json_out = '{\"foods\":{';

// Need to extend
app.post('/photo', function (req, res) {
    // Use for latter test
    // image = req.photo;
    // degital = base64Img.base64Sync(image).split(',')[1].toString();

    // image = req.body.base64;

    res.setHeader('Content-Type', 'application/json');
    console.log("There is a new request");
    faiApp.models.predict(Clarifai.GENERAL_MODEL, {base64: degital}).then(
        function(response) {
            var foods = response.outputs[0].data.concepts;
            for (var i = 0; i < foods.length; i++) {
                var name = foods[i].name;
                var accuracy = foods[i].value;
                if (accuracy < 0.9) continue;

                var query  = 'SELECT * FROM canguan.restaurants WHERE contents LIKE \'%' + name + '%\';';

                connection.query(query, function (error, results, field) {
                    if (error) throw error;

                    if (results.length != 0) {
                        json_out = json_out + '\"' + name + '\":[';
                        for (var i = 0; i < results.length; i++) {
                            // json_out = json_out + "{" + '\"' +
                        }

                    }
                    console.log(results.length);
                });

                console.log(name);
            }
            res.send(JSON.stringify(response));
        },


        // Error throw
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
