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


	app.get('/addtheatre', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('addtheatre.pug', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/addtheatre', function(req,res) {
		    
	});

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

	app.get('/adminprofile', isLoggedIn, function(req, res) {
		res.render('adminprofile.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});

	//Booking SECTION
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
