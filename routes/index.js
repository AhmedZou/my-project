var _ = require('underscore'),
	keystone = require('keystone'),
	i18n = require("i18n"),
    middleware = require('./middleware'),
    jwt = require('jsonwebtoken'),
	importRoutes = keystone.importer(__dirname);

// Add-in i18n support
keystone.pre('routes', i18n.init);
keystone.pre('routes', middleware.detectLang);

//// code  
/*app.use(function(req, res, next){

    let render_old = res.render;
    res.render = function render(vn, opt, cb){
        if (_.isNil(opt)){
            opt = { helpers: { __ : res.locals.__ } };
        } else {
            _.set(opt, 'helpers.__', res.locals.__);
        }

        arguments[1] = opt;
        return render_old.apply(this, arguments);
    }

    return next();
},);
*/

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')

};

// Setup Route Bindings
exports = module.exports = function(app) {
	
    // authentification jwt

   /* app.get('/', function (req, res) {
        res.send('GET request to the homepage');
      });
*/
   app.all('/signinjwt', routes.views.session.signinjwt);
   app.get('/signoutjwt', routes.views.session.signoutjwt);
    app.all('/*', middleware.jwtCheck);

    
    // Views
    
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
    app.get('/gallery', routes.views.gallery);
    app.get('/document', routes.views.document);
    app.all('/contact', routes.views.contact);

  
    
    
    

}
