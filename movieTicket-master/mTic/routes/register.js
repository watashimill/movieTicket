var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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

/*
connection.query('SELECT * from admin', function(err, rows, fields) {
   if (!err)
     console.log('The solution is: ', rows);
   else
     console.log('Error while performing Query.');
 });*/




/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Sign up'} );
});

router.post('/register', function (req, res,next) {
  // this is where you handle the POST request.
  var createCustomer = {
    c_email : req.body.email,
    password: req.body.pwd,
    phone_no: req.body.phone,
    c_fname: req.body.firstname,
    c_lname: req.body.lastname

   }
   // now the createStudent is an object you can use in your database insert logic.
   connection.query('INSERT INTO customer SET ?', createCustomer, function (err, resp) {
     if (err) throw err;
     // if there are no errors send an OK message.
     res.send('Save succesfull');
   });
 });

module.exports = router;
