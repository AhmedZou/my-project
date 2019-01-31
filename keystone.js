// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');
var i18n= require('i18n');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'My Site',
	'brand': 'My Site',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',
	//'session': false,



	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
		
	}).engine,
	

	'emails': 'templates/emails',

	'auto update': true,
	'session': false,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Configure i18n

i18n.configure({
	locales:['en', 'de', 'ar'],
	directory: __dirname + '/locales'
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'posts': ['posts' ,'post-comments','post-categories'],
	//'posts': ['posts', 'post-comments', 'post-categories'],

	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
});




keystone.start();
