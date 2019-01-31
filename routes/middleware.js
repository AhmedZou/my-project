/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');
var jwt = require('jsonwebtoken');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'وثائق خارجية', key: 'document', href:'/document' },
		{ label: 'وثائق داخلية', key: 'contact', href: '/contact' },
		{ label: 'معرض الصور', key: 'gallery', href: '/gallery' },
		{ label: 'مقالات داخلية', key: 'blog', href: '/blog' },
		{ label: 'الرئيسية', key: 'home', href: '/' },

		
			
	];
   
	if (keystone.app.locals.user !== null && keystone.app.locals.user !== undefined) { 
		res.locals.user = keystone.app.locals.user;
		console.log("user:");
		console.log(keystone.app.locals.user);
	  }

	
	//console.log("usss222"+keystone.app.locals.user);
	//res.locals.user = {};
	
	res.locals.monnom = "jappa";
	next();
	/// auth 
	//res.locals.user = keystone.app.locals.user;
	//console.log(res.locals);
    //console.dir(config.root);
//console.dir(path.join(config.root, 'server/views'));
	//next();
	

};

// routes/middleware.js

exports.detectLang = function(req, res, next) {
    var match = req.url.match(/^\/(de|en|ar)([\/\?].*)?$/i);

    if (match) {
        req.setLocale(match[1]);
        // Make locale available in template
        // (necessary until i18n 0.6.x)
        res.locals.locale = req.getLocale();
        // reset the URL for routing
        req.url = match[3] || '/';
    } else {
		// Here you can redirect to default locale if you want
		//req.setLocale(req.params.lang);
    }

    next();
}
/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


/// jwt authentification 

exports.jwtCheck = function (req, res, next) {
 
    if (!req.cookies.uToken) {
        req.user = null;
        res.cookie('afterLoginUrl', req.originalUrl, { maxAge: 900000, httpOnly: true });
		req.flash('success', { title:'Please sign in to access this page.'});
		
		res.redirect('/signinjwt');
    } else {
        
        jwt.verify(req.cookies.uToken, keystone.get('jwt secret'), function(err, decoded) {
			console.log('okkkk 1');


            if(!err) {
				
				console.log('errrrrrrreur : ', +err );
                req.user = null;
                res.clearCookie('uToken');
                res.cookie('afterLoginUrl', req.originalUrl, { maxAge: 900000, httpOnly: true });
                req.flash('error',  'Please sign in to access this page.');
				res.redirect('/signinjwt');
				console.log('okkkk 2');

            } else {
				//console.log('okkkk');
				console.log(decoded)

				next();
		

			}
		 
            
        });
    }
};


