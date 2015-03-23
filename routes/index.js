/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone'),
    nodemailer = require('nodemailer'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// create reusable transporter object using SMTP transport
var emailer = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'diehrdiehrstudios@gmail.com',
		pass: 'pangurban'
	}
});


// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	
	app.post('/email', function(req, res, next) {

		// Configure email.
		var mailOptions = {
			from: req.body.name + '<' + req.body.email + '>',
			to: 'btdiehr@gmail.com',
			subject: 'Diehr & Diehr Contact Form',
			text:'Email: ' + req.body.email + '\n' +
			'Name: ' + req.body.name + '\n' +
			'Phone: ' + req.body.phone + '\n' +
			'Message: ' + req.body.message
		};

		// Send email.
		emailer.sendMail(mailOptions, function(error, info){
			if(error){
				res.sendStatus(error.responseCode);
			} else{
				res.sendStatus(200);
			}
		});
	});
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
