var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Watashimill1',
  database : 'movieticket'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})
/* GET home page. */
router.get('/', function(req, res, next) {
  
    res.render('index');

 
});


module.exports = router;
