/**
 * Created by xiaochen on 4/17/18.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var port = 8585;
var app = express();
var server = http.createServer(app);
const Clarifai = require('clarifai');
const faiApp = new Clarifai.App({
       apiKey: 'fdf54109d2704294a5861bd7387bfbdf'
 });

var pug = require('pug');
app.set('view engine', 'pug');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Need to extend
app.post('/photo', function (req, res) {
    console.log(req.body);
    res.send(req.body);
});

app.get('/testPhoto', function (req, res) {
    console.log('testPhoto');
    res.render('analyze_image');
});

app.get('/testFai', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
    console.log('testFai');
      // predict the contents of an image by passing in a url
      // var url = 'https://samples.clarifai.com/metro-north.jpg';
      
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
});

// app.configure(function () {
//     app.use(express.static(__dirname + '/html'));
// });

server.listen(port);
console.log('Sever Started');
