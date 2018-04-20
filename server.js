

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var port = 8585;
var app = express();
var server = http.createServer(app);

// Clarifai API Related
var server = http.createServer(app);
const Clarifai = require('clarifai');
const faiApp = new Clarifai.App({
       apiKey: 'fdf54109d2704294a5861bd7387bfbdf'
 });

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

app.get('/testFai', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
    console.log('testFai');
      var url = 'https://www.foodsforbetterhealth.com/wp-content/uploads/2017/01/onion-sandwitch-750x400.jpg';
      faiApp.models.predict(Clarifai.GENERAL_MODEL, url).then(
        function(response) {
          console.log(response);
          res.send(JSON.stringify(response));
        },
        function(err) {
          console.error(err);
          res.send(JSON.stringify(err));
        }
      );
})

server.listen(port);
console.log('Server Started');
