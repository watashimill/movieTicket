// routes/routes.js

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		connection.query('INSERT INTO tickets SET ?', {price: '160'}, function(err, result) {
  	if (err) throw err;

  	console.log(result.insertId);
		res.render('home.pug'); //load index
		});

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

		res.render('addtheatre.pug', { message: req.flash('theatreMessage'),success: req.flash('success') , user : req.user});
	});


	app.post('/addtheatre', function(req,res) {
		var t_id = req.body.t_id;
		var t_location = req.body.t_location;
		var insertQuery = "INSERT INTO `movieticket`.`theatre`(`theatre_id`,`location`) values (?,?)";
		if (t_id == "" || t_location == "" ){
			req.flash('theatreMessage', 'TPlease Insert all values')
			res.redirect('/addtheatre');
			}else{
			connection.query("SELECT * FROM `movieticket`.`theatre` WHERE `theatre_id` = "+t_id,function(err, rows) {
                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('theatreMessage', 'The currenty Theatre is already exist')
                    	res.redirect('/addtheatre');
                }else {
                connection.query(insertQuery,[t_id ,t_location],function(err, rows) {
                    if (err) throw err;
                    	req.flash('success', 'You successfully add Theatre. ')
                    	res.redirect('/addtheatre');

                 });
               }
         });
			 }
	});

	// =====================================
	// ADD MOVIE ===============================
	// =====================================

	app.get('/addmovie', isLoggedIn, function(req, res) {

		res.render('addmovie.pug', { message: req.flash('movieMessage') ,success: req.flash('success'),user : req.user});
	});

	// process the signup form
	app.post('/addmovie', function(req,res) {
		var m_id = req.body.m_id;
		var m_name = req.body.m_name;
		var m_actors = req.body.m_actors;
		var m_director = req.body.m_director;
		var m_releaseDate = req.body.m_releaseDate;
		var insertQuery = "INSERT INTO `movieticket`.`movie`(`m_id`,`m_name`,`actors`,`director`,`release_date`) values (?,?,?,?,?)";
		if (m_id == "" || m_name == "" || m_actors =="" || m_director =="" || m_releaseDate =="" ){
			req.flash('movieMessage', 'Please Insert all values')
			res.redirect('/addmovie');
			}else{
			connection.query("SELECT * FROM `movieticket`.`movie` WHERE `m_id` = "+m_id,function(err, rows) {

                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('movieMessage', 'The currenty Movie is already exist')
                    	res.redirect('/addmovie');
                }else {
                connection.query(insertQuery,[m_id, m_name, m_actors, m_director , m_releaseDate],function(err, rows) {
                    if (err) throw err;
                    	req.flash('success', 'You successfully add Movie. ')
                    	res.redirect('/addmovie');

                 });
            }
         });
			 }
	});
	// =====================================
	// ADD Hall ===============================
	// =====================================
	app.get('/addhall', isLoggedIn, function(req, res) {

		res.render('addhall.pug', { message: req.flash('hallMessage') ,success: req.flash('success'), user : req.user});
	});
	app.post('/addhall', function(req,res) {
		var t_id = req.body.t_id;
		var h_id = req.body.h_id;
		var h_name = req.body.h_name;
		var insertQuery = "INSERT INTO `movieticket`.`hall`(`hall_id`,`hall_name`,`Theatre_theatre_id`) values (?,?,?)";
			if (t_id == "" || h_id == "" || h_name ==""){
				req.flash('hallMessage', 'Please Insert all values')
				res.redirect('/addhall');
			}else{
			connection.query("SELECT * FROM `movieticket`.`hall` WHERE `hall_id` = "+h_id+" AND `Theatre_theatre_id` = "+t_id,function(err, rows) {
                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('hallMessage', 'Hall or Theatre is already exist')
                    	res.redirect('/addhall');
                }else {
                connection.query("SELECT * FROM `movieticket`.`theatre` WHERE theatre_id = ?",[t_id],function(err, rows) {
                    if (err) throw err;
                    if (!rows.length) {

                    	req.flash('hallMessage', 'NOT Have This Theatre');
                    	res.redirect('/addhall');
                    }else {
                    	connection.query(insertQuery,[h_id,h_name,t_id],function(err, rows) {
                    		if (err) throw err;
                    			req.flash('success', 'You successfully add Hall')
                    			res.redirect('/addhall');


                    });

                    }

                 });
            }
          });
				}
	});


	// =====================================
	// ADD SHOW ===============================
	// =====================================
	app.get('/addshow', isLoggedIn, function(req, res) {
		res.render('addshow.pug', { message: req.flash('showMessage'),success: req.flash('success') , user : req.user});
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
		if (t_id == "" || h_id == "" || s_id =="" || stS =="" || stE =="" || lang =="" || m_id ==""){
			req.flash('showMessage', 'Please Insert all values')
			res.redirect('/addshow');
		}else
		{connection.query("SELECT * FROM `movieticket`.`hall` WHERE `hall_id` =' "+h_id+"' AND `Theatre_theatre_id` = '"+t_id+"'",function(err, rows) {
									if (err) throw err;
									if (!rows.length) {
										req.flash('showMessage', 'Not Have Hall or Theatre ')
										res.redirect('/addshow');
							}else{
                connection.query("SELECT * FROM `movieticket`.`shows` WHERE `show_id`= "+s_id,function(err, rows) {
                    if (err) throw err;
                    if (rows.length) {
                    	req.flash('showMessage', 'Show or Hall and Theatre is already exist')
                    	res.redirect('/addshow');
                    }else {
                    	connection.query(insertQuery,[s_id,stS,stE,lang,m_id,t_id,h_id],function(err, rows) {
                    		if (err) throw err;
                    			req.flash('success', 'You successfully add Show.')
                    			res.redirect('/addshow');


                    });

                    }

                 });
							 }
							});
						}

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
                    			req.flash('success', 'You successfully add Show.')
                    			res.redirect('/addshow');


                    });

                    }

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
	app.get('/getMovie',function(req,res){
		connection.query('Select m_name from movie', function(err, rows) {
			if (!err){
				//console.log(rows);
				res.send(JSON.stringify(rows));
			} else {
				console.log('Error while performing Query.');
			}
		});
	});

	app.get('/getLocation?',function(req,res){
		var Moviename = req.query.Movie;
		console.log(Moviename);
		connection.query('SELECT DISTINCT theatre.location FROM movie INNER JOIN shows ON movie.m_id = shows.Movie_m_id INNER JOIN theatre ON theatre.theatre_id = shows.Hall_Theatre_theatre_id WHERE m_name = '+'"'+Moviename+'"', function(err, rows) {
			if (!err){
				res.send(JSON.stringify(rows));
			} else {
				console.log('Error while performing Query.');
			}
		});
	});

	app.get('/getShowtime?',function(req,res){
		var Mname = req.query.Mname;
		var Tname = req.query.Tname;
		console.log(Mname,Tname);
		connection.query('SELECT shows.st_time FROM shows INNER JOIN movie ON movie.m_id = shows.Movie_m_id INNER JOIN theatre ON theatre.theatre_id = shows.Hall_Theatre_theatre_id WHERE movie.m_name = '+'"'+Mname+'"'+' AND theatre.location ='+'"'+Tname+'"', function(err, rows) {
			if (!err){
				res.send(JSON.stringify(rows));
			} else {
				console.log('Error while performing Query.');
			}
		});
	});

	app.get('/getSeats?',function(req,res){
		var M = req.query.M;//movie
		var T = req.query.T;//theatre
		var S = req.query.S;//showtime
		var g = [];
		console.log(typeof(g));
		var query2 = 'SELECT DISTINCT seats.seat_name,seats.seat_num,tickets.Seats_Hall_hall_id, tickets.Seats_Hall_Theatre_theatre_id,theatre.location,shows.st_time '+
        			'FROM tickets '+
        			'INNER JOIN shows ON shows.show_id = tickets.Show_show_id and shows.Hall_hall_id = tickets.Seats_Hall_hall_id '+
        			'INNER JOIN seats ON seats.seat_id = tickets.Seats_seat_id '+
        			'INNER JOIN theatre ON tickets.Seats_Hall_Theatre_theatre_id = theatre.theatre_id '+
        			'INNER JOIN movie ON movie.m_id = shows.Movie_m_id '+
        			'WHERE  theatre.location = '+'"'+T+'"'+' AND shows.st_time = '+'"'+S+'"'+' AND movie.m_name = '+'"'+M+'"';
        			//////query2 for seat that already booked in the same M,T,S of query//////
		connection.query('SELECT seats.seat_name,seats.seat_num,seats.Hall_hall_id,seats.Hall_Theatre_theatre_id FROM seats '+
			'INNER JOIN shows ON shows.Hall_Theatre_theatre_id = seats.Hall_Theatre_theatre_id AND shows.Hall_hall_id = seats.Hall_hall_id '+
			'INNER JOIN movie ON shows.Movie_m_id = Movie_m_id '+
			'INNER JOIN theatre ON shows.Hall_Theatre_theatre_id = theatre.theatre_id '+
			'WHERE  theatre.location = '+'"'+T+'"'+' AND shows.st_time = '+'"'+S+'"'+' AND movie.m_name = '+'"'+M+'"', function(err, rows) {
			if (!err){
				g.push(rows);
				console.log(typeof(g));
				console.log('g1:',g);
				//res.send();
			} else {
				console.log('Error while performing Query.');
			}
		});
		connection.query(query2, function(err, result) {
            if (err) throw err
            if(result.length == 0){ //if doesn't find ticket
            	res.send(JSON.stringify(g));
                console.log("No Seats Book");
            }else{
            	console.log('result : ',result);
                g.push(result);
                console.log('g2 : ',g);
                console.log(typeof(g));
                res.send(JSON.stringify(g));
            }
        });

	});


	// =====================================
	//Booking SECTION ++++++++++++++++++++++
	// =====================================
	/*app.get('/tickets', isLoggedIn, function(req, res, next) {
		res.render('tickets.pug', {
			user : req.user // get the user out of session and pass to template
		});
	});*/

	app.get('/tickets', isLoggedIn, function(req, res, next) {
		var customer_id = req.user.id
		var movie_nameA = [];
		var show_dateA = [];
		var hall_nameA = [] ;
		var t_locationA = [] ;
		var show_time_stA = [];
		var show_time_endA  = [];
		var movie_picA= [];
	  var seatsA = [];
		var query = "SELECT movie.m_name , shows.showDate ,shows.st_time,shows.end_time ,theatre.location, hall.hall_name ,seats.seat_name,seats.seat_num,movie.movie_pic FROM movieticket.customer ";
    query += "INNER JOIN movieticket.tickets ON customer.id = tickets.Customer_id ";
    query += "INNER JOIN shows ON tickets.Show_show_id = shows.show_id ";
    query += "INNER JOIN movie ON shows.Movie_m_id = movie.m_id ";
    query += "INNER JOIN seats ON tickets.Seats_seat_id = seats.seat_id AND tickets.Seats_Hall_hall_id = seats.Hall_hall_id AND tickets.Seats_Hall_Theatre_theatre_id = Seats.Hall_Theatre_theatre_id ";
    query += "INNER JOIN hall ON tickets.Seats_Hall_hall_id = hall.hall_id AND tickets.Seats_Hall_Theatre_theatre_id = hall.Theatre_theatre_id ";
		query += "INNER JOIN movieticket.theatre on tickets.Seats_Hall_Theatre_theatre_id = theatre.theatre_id " ;
		query += "WHERE customer.id = '" + customer_id + "' " ;

		connection.query(query, function(err, rows) {
			if (err) throw err
			if(rows.length == 0){ //if doesn't find ticket
				console.log("Ticket Mismatch");
			}else{
				for (var i = 0; i < rows.length; i++) {

				 var movie_name = rows[i].m_name;
         var show_date = rows[i].showDate;
         var show_start_time = rows[i].st_time;
				 var show_end_time = rows[i].end_time;
         var hall_name = rows[i].hall_name;
				 var t_location = rows[i].location;
         var seat_name = rows[i].seat_name;
				 var seat_num = rows[i].seat_num;
				 var timeshow_hr = show_start_time.split(":")[0];
         var timeshow_m = show_start_time.split(":")[1];
				 var timeEnd_hr = show_end_time.split(":")[0];
         var timeEnd_m = show_end_time.split(":")[1];
				 var show_time_st = timeshow_hr+":"+timeshow_m ;
				 var show_time_end = timeEnd_hr+":"+timeEnd_m ;
				 var movie_pic =  rows[i].movie_pic;
				 var seats = seat_name+""+seat_num;
				 movie_nameA.push(movie_name);
				 show_dateA.push(show_date);
				 show_time_stA.push(show_time_st);
				  show_time_endA.push(show_time_end);
				 hall_nameA.push(hall_name);
				 t_locationA.push(t_location);
				 seatsA.push(seats);
				 movie_picA.push(movie_pic);
				 console.log(movie_nameA);
				console.log(show_dateA)
				console.log(show_time_stA )
				console.log(show_time_endA )
				console.log(hall_nameA)
				console.log(t_locationA)
				console.log(movie_picA)
				console.log(seatsA)
				console.log(rows.length)


			}
		}

			res.render('tickets.pug', {
				user : req.user,
				count : rows.length,
				movie_name : movie_nameA,
				show_date : show_dateA ,
				show_time_st: show_time_stA,
				show_time_end: show_time_endA,
				hall_name : hall_nameA,
				t_location : t_locationA,
				seats: seatsA,
				movie_pic: movie_picA

			});
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
