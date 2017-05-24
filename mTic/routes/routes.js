// routes/routes.js

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('home.pug'); //load index
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.pug', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.pug', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// ADD THEATRE ===============================
	// =====================================
	app.get('/addtheatre', isLoggedIn, function(req, res) {
		res.render('addtheatre.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});

	
	app.post('/addtheatre', function(req,res) {
		var t_id = req.body.t_id;
		var t_location = req.body.t_location;
		var insertQuery = "INSERT INTO `movieticket`.`theatre`(`theatre_id`,`location`) values (?,?)";

                connection.query(insertQuery,[t_id ,t_location],function(err, rows) {
                    if (err) throw err;
                    	res.redirect('/addtheatre');

                 });
	});

	// =====================================
	// ADD MOVIE ===============================
	// =====================================
	
	app.get('/addmovie', isLoggedIn, function(req, res) {
		res.render('addmovie.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// process the signup form
	app.post('/addmovie', function(req,res) {
		var m_id = req.body.m_id;
		var m_name = req.body.m_name;
		var m_actors = req.body.m_actors;
		var m_director = req.body.m_director;
		var m_releaseDate = req.body.m_releaseDate;
		var insertQuery = "INSERT INTO `movieticket`.`movie`(`m_id`,`m_name`,`actors`,`director`,`release_date`) values (?,?,?,?,?)";

                connection.query(insertQuery,[m_id, m_name, m_actors, m_director , m_releaseDate],function(err, rows) {
                    if (err) throw err;
                    	res.redirect('/addmovie');

                 });
	});
	// =====================================
	// ADD Hall ===============================
	// =====================================
	app.get('/addhall', isLoggedIn, function(req, res) {
		
		res.render('addhall.pug', { message: req.flash('hallMessage') , user : req.user});
	});
	app.post('/addhall', function(req,res) {
		var t_id = req.body.t_id;
		var h_id = req.body.h_id;
		var h_name = req.body.h_name;
		var t_location = req.body.t_location;
		var insertQuery = "INSERT INTO `movieticket`.`hall`(`hall_id`,`hall_name`,`Theatre_theatre_id`) values (?,?,?)";

                connection.query("SELECT * FROM `movieticket`.`theatre` WHERE theatre_id = ?",[t_id],function(err, rows) {
                    if (err) throw err;
                    if (!rows.length) {

                    	req.flash('hallMessage', 'NOT Have This Theatre');
                    	res.redirect('/addhall');
                    }else {
                    	connection.query(insertQuery,[h_id,h_name,t_id],function(err, rows) {
                    		if (err) throw err;
                    			req.flash('hallMessage', 'Success')
                    			res.redirect('/addhall');
          
                        
                    });

                    }

                 });
	});

	// =====================================
	// ADD SEATS ===============================
	// =====================================
	app.get('/addseats', isLoggedIn, function(req, res) {
		res.render('addseats.pug', { message: req.flash('seatMessage') , user : req.user});
	});
	app.post('/addseats', function(req,res) {
		var t_id = req.body.t_id;
		var h_id = req.body.h_id;
		var s_id = req.body.s_id;
		var s_name = req.body.s_name;
		var s_num = req.body.s_num;
		var insertQuery = "INSERT INTO `movieticket`.`seats`(`seat_id`,`seat_name`,`seat_num`,`Hall_Theatre_theatre_id`,`Hall_hall_id`) values (?,?,?,?,?)";
			connection.query("SELECT * FROM `movieticket`.`seats` WHERE `seat_id`= "+s_id+" AND `Hall_hall_id` = "+h_id+" AND `Hall_Theatre_theatre_id` = "+t_id,function(err, rows) {
                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('seatMessage', 'This Seat is already exist')
                    	res.redirect('/addshow');
                }else {
                connection.query("SELECT * FROM `movieticket`.`hall` WHERE `hall_id`= "+h_id+" AND `Theatre_theatre_id` = "+t_id,function(err, rows) {
                    if (err) throw err;
                    if (!rows.length) {
                    	req.flash('seatMessage', 'NOT Have This Theatre or Hall')
                    	res.redirect('/addseats');
                    }else {
                    	connection.query(insertQuery,[s_id,s_name,s_num,t_id,h_id],function(err, rows) {
                    		if (err) throw err;
                    			req.flash('seatMessage', 'Success')
                    			res.redirect('/addseats');
          
                        
                    });

                    }

                 });
            }
         });

	});
	// =====================================
	// ADD SHOW ===============================
	// =====================================
	app.get('/addshow', isLoggedIn, function(req, res) {
		res.render('addshow.pug', { message: req.flash('showMessage') , user : req.user});
	});
	app.post('/addshow', function(req,res) {
		var t_id = req.body.t_id;
		var h_id = req.body.h_id;
		var s_id = req.body.s_id;
		var stS = req.body.stS;
		var stE = req.body.stE;
		var lang = req.body.lang;
		var m_id = req.body.m_id;
		var insertQuery = "INSERT INTO `movieticket`.`show`(`show_id`,`st_time`,`end_time`,`language`,`Movie_m_id`,`Hall_Theatre_theatre_id`,`Hall_hall_id`)values (?,?,?,?,?,?,?)";

                connection.query("SELECT * FROM `movieticket`.`show` WHERE `show_id`= "+s_id,function(err, rows) {
                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('showMessage', 'This Show is already exist')
                    	res.redirect('/addshow');
                    }else {
                    	connection.query(insertQuery,[s_id,stS,stE,lang,m_id,t_id,h_id],function(err, rows) {
                    		if (err) throw err;
                    			req.flash('showMessage', 'Success')
                    			res.redirect('/addshow');
          
                        
                    });

                    }

                 });
	});
	// =====================================
	// ADMIN LOGIN ===============================
	// =====================================
	app.get('/admin', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('admin.pug', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/admin', passport.authenticate('local-admin', {
            successRedirect : '/adminprofile', // redirect to the secure profile section
            failureRedirect : '/admin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),

        function(req, res) {
            console.log("helloAdmin");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/admin');
    });

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});
	// =====================================
	// ADMIN PROFILE SECTION ===============================
	// =====================================
	app.get('/adminprofile', isLoggedIn, function(req, res) {
		res.render('adminprofile.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	// =====================================
	//Booking SECTION ++++++++++++++++++++++
	// =====================================
	app.get('/booking', isLoggedIn, function(req, res) {
		res.render('booking.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
