let http = require('http');
let express = require('express');
let bodyParser = require('body-parser');
let base64Img = require('base64-img');
let mysql = require('mysql');
let formidable = require('formidable');

let port = 8585;
let app = express();

// Clarifai API Related
let server = http.createServer(app);
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
let connection = mysql.createConnection({
    host : 'canting.chugopmntol2.us-east-1.rds.amazonaws.com',
    user : 'root',
    password : '1993714cx',
    database : 'canguan'
});

connection.connect();
console.log("Successful connect to Database");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

let foodsName = {beef : true, steak : true, barbecue : true, fillet : true, pork : true, ham : true,
    bread : true, tomato : true, cheese : true, chicken : true, rice : true, curry : true,
    sauce : true,
};

app.post('/photo', function (req, res) {

    console.log("There is a new request for photo");
    // let degital = Object.keys(req.body)[0];
    // degital = degital.split(' ').join('+');
    let degital = req.body.image;

    res.setHeader('Content-Type', 'application/json');

    faiApp.models.predict(Clarifai.GENERAL_MODEL, {base64: degital}).then(
        function(response) {
            let foods = response.outputs[0].data.concepts;
            // let query = 'SELECT * FROM canguan.restaurants WHERE contents LIKE \'%' + foods[0].name + '%\'';
            let query = 'SELECT * FROM canguan.restaurants WHERE find_in_set(' + foods[0].name + ', contents)';

            for (let i = 1; i < foods.length; i++) {
                if (foods[i].value < 0.9) continue;
                // query = query + ' or contents LIKE \'%' + foods[i].name + '%\'';
                query = + ' or find_in_set(' + foods[i].name + ', contents)';
            }
            query = query + ";";
            console.log(query);

            connection.query(query, function (error, results, field) {
                if (error) throw error;
                console.log(results);
                res.send(JSON.stringify(results));
            });
    },
        // Error throw
        function(err) {
            console.error(err);
            res.send(JSON.stringify(err));
        });
});

app.post('/shopping', function (req, res) {
    console.log("There is a new request for shopping list");
    let degital = req.body.image;
    // console.log(degital);

    res.setHeader('Content-Type', 'application/json');

    faiApp.models.predict(Clarifai.GENERAL_MODEL, {base64: degital}).then(
        function(response) {
            let foods = response.outputs[0].data.concepts;
            let list = [];
            for (let i = 0; i < foods.length; i++) {
                if (foods[i].value < 0.9 || !foodsName.hasOwnProperty(foods[i].name)) continue;
                list.push({name : foods[i].name});
            }
            console.log(JSON.stringify(list));
            res.send(JSON.stringify(list));
        },
        // Error throw
        function(err) {
            console.error("Thers is a bug");
            errorobj = [{name : "The photo cannot be recognized"}];
            res.send(JSON.stringify(errorobj));
        });
});

server.listen(port);
console.log('Server Started');
