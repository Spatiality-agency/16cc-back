const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var mysql = require('mysql');

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host: 'localhost', //localhost:3306
  user: 'root', //16user1
  password: 'root', //zPz~j456
  database: 'Test_16_db'
});

const route = express.Router();

const db = require("./app/models");
const Role = db.role;

connection.connect();

/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});*/

app.use('/v1', route);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

/*connection.query('select * from markers', function (err, rows, fields) {
  if (err) throw err;
  console.log('hello')
  app.use('/markers', (req, res) => {
    res.send({
      rows: rows
    });
  });
  console.log(rows)
});*/


/*route.get('/markers', (req, res) => {
  connection.query('select * from markers', function (err, rows, fields) {
    if (err) throw err;
    console.log('hello')
    app.use('/markers', (req, res) => {
      res.send({
        rows: rows
      });
    });
    console.log(rows)
  });
});*/

route.get('/markers', (req, res) => {
  var sql = "select * from markers";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send({
      rows: result
    });
  });
});

route.post('/MarkerImages', (req, res) => {
  const { id } = req.body;
  console.log('MarkerImage- body', req.body);
  var sql = "select url from `images` WHERE `idzone` = '" + id +"'" ;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result)
    res.send({
      rows: result
    });
  });
});

route.post('/new-marker', (req, res) => {
  const { userid, lat, lng, img, difficulty, size, type1, type2, type3, glove, bag } = req.body;
  //console.log('body: ', req.body);

  var sql = "INSERT INTO `markers`(`userid`, `latitude`, `longitude`) VALUES ('" + userid + "','" + lat + "','" + lng + "')";
  var sql2 = "SELECT id FROM `markers` ORDER BY id DESC LIMIT 1";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    //console.log(result)
  });

  var id = connection.query(sql2, function (err, result) {
    if (err) throw err;
    console.log('zoneid: ', result[0].id)
    var id2 = result[0].id
    console.log('file :', img)

    var sql4 = "INSERT INTO `details`(`idzone`, `difficulty`, `size`, `type1`, `type2`, `type3`, `glove`, `bag`) VALUES ('" + id2 + "','" + difficulty + "','" + size + "','" + type1 + "','" + type2 + "','" + type3 + "','" + glove + "','" + bag + "')";

    connection.query(sql4, function (err, result) {
      if (err) throw err;
      console.log('result sql4', result)
    });
    img.forEach(img => {
      var sql3 = "INSERT INTO `images`(`idzone`, `url`) VALUES ('" + id2 + "','" + img + "')";
      connection.query(sql3, function (err, result) {
        if (err) throw err;
        console.log('result sql3', result)
      });
    });
    res.send({
      rows: result,
      test: "success"
    });
  });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}
