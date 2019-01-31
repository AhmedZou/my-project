var keystone = require('keystone');

exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
        locals = res.locals;
    
    locals.section = 'session';
    res.clearCookie('uToken');
    keystone.app.locals.user = null;
    
    res.redirect('/');
};