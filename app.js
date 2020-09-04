const express = require('express');
const bodyParser = require('body-parser');
const dbConn = require('./db.config');
const userCRUD = require('./user_crud');
// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
//Database Connections
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });
// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});
// using as middleware
app.use('/users', userCRUD)
// export express app
module.exports = app;
