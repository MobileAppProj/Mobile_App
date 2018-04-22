let http = require('http');
let express = require('express');
let bodyParser = require('body-parser');
let base64Img = require('base64-img');
let mysql = require('mysql');

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
    host : 'mysql.chugopmntol2.us-east-1.rds.amazonaws.com',
    user : 'root',
    password : '1993714cx',
    database : 'canguan'
});

connection.connect();
console.log("Successful connect to Database");

// app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

let text = '{ "code": 0, "err": " ","data": {"Apple": "information", "Orange": "information"}, "string": "Hello World"}';
let json = JSON.parse(text);

let image = base64Img.base64Sync('/Users/xiaochen/Desktop/Course/49788 Mobile Apps/team/Mobile_App/test.jpg');
let degital = image.split(',')[1].toString();

// Need to extend
app.post('/photo', function (req, res) {
    // Use for latter test
    // image = req.photo;
    // degital = base64Img.base64Sync(image).split(',')[1].toString();

    // image = req.body.base64;
    console.log(req.body);

    res.setHeader('Content-Type', 'application/json');
    console.log("There is a new request");

    faiApp.models.predict(Clarifai.GENERAL_MODEL, {base64: degital}).then(
        function(response) {
            let foods = response.outputs[0].data.concepts;

            let query = 'SELECT * FROM canguan.restaurants WHERE false';
            for (let i = 0; i < foods.length; i++) {
                if (foods[i].value < 0.9) continue;
                query = query + ' or contents LIKE \'%' + foods[i].name + '%\'';
            }
            query = query + ";";

            connection.query(query, function (error, results, field) {
                res.send(JSON.stringify(results));
            });

            // for (let i = 0; i < foods.length; i++) {
        //
        //     let list = [];
        //     let name = foods[i].name;
        //     let accuracy = foods[i].value;
        //     if (accuracy < 0.9) continue;
        //     let query  = 'SELECT * FROM canguan.restaurants WHERE contents LIKE \'%' + name + '%\';';
        //
        //     connection.query(query, function (error, results, field) {
        //
        //         if (error) throw error;
        //         for (let i = 0; i < results.length; i++) {
        //             if (results[i].length != 0) {
        //                 list.push(results[i].RowDataPacket);
        //             }
        //         }
        //     });
        //
        //     if (list.length != 0) {
        //         let food = {name : list};
        //         list_allfood.push(food);
        //     }
        // }
        // let output = {foods : list_allfoods};
        //
        // res.send(JSON.stringify(output));
    },

        // Error throw
        function(err) {
            console.error(err);
            res.send(JSON.stringify(err));
        });

});

server.listen(port);
console.log('Server Started');
