var keystone = require('keystone'),
    async = require('async'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    crypto = require('crypto'),
    utils = require('keystone-utils');
 
exports = module.exports = function(req, res) {
    console.log('log ok');
    if (req.user && req.cookies.uToken) {
        return res.redirect(req.cookies.target || '/me');
    }
    
    var view = new keystone.View(req, res),
        locals = res.locals;
        locals.section = 'session';
        locals.form = req.body;
        console.log('view ok');


   /* view.on('post', { action: '-pcreateost' }, function(next) {
        console.log("test get ok");  
    })*/

    view.on('post', function(next) {
        console.log('login ok');
        console.log('email :'+req.body.email+' '+req.body.password);
        // req.flash('success', { title: 'Please enter your username and password.'});
        if (!req.body.email || !req.body.password) {
            req.flash('error', { title:  'Please enter your username and password.'});
            return next();
        }
        
            var token = '',
                userdata = {};
                async.series([      
                    function (next) {             
                        var User = keystone.list(keystone.get('user model'));
                        if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
                            
                            if (!utils.isEmail(req.body.email)) {
                                return next({message:'Incorrect email or password'});
                            }
                            var emailRegExp = new RegExp('^' + utils.escapeRegExp(req.body.email) + '$', 'i');
                         // console.log('rere'+emailRegExp);
                            User.model.findOne({ email: emailRegExp }).exec(function (err, user) {
                                if (user) {
                                    user._.password.compare(req.body.password, function (err, isMatch) {
                                        if (!err && isMatch) {
                                            userdata = user;
                                            return next();
                                        } else {
                                            return next({ message: err || 'Incorrect email or password' });
                                        }
                                    });
                                } else {
                                    return next({ message: err });
                                }
                            });
                        } else {
                            return next({ message: 'Incorrect user or password'});
                        }
                    },
                    function(next) { 
                        token = jwt.sign({id: userdata._id, email:userdata.email}, 'secret', { expiresIn: '15s' });
                        console.log('token : '+token);
                        keystone.app.locals.user = userdata;
                        // app.locals.user = userdata;
                        console.log(' page 1');
                        
                        return next();
                    },
                    function(next) {
                         res.cookie('uToken', token,  { maxAge: 900000, httpOnly: true });
                         res.clearCookie('afterLoginUrl');  
 
                        return next();                     
                    },
                    function(next) {
                        console.log( ' hiii')
                        if (req.body.target && !/join|signinjwt/.test(req.body.target)) {
                            return res.redirect(req.body.target); 
                              // return res.redirect ('/');
                            console.log( ' befor  login')

                            return next();        
                        } else {

                             var afterLoginUrl = req.cookies.afterLoginUrl || '/me'; 

                             return res.redirect(afterLoginUrl);
                             console.log( ' hiii 2')

                            return res.redirect('/blog');
                            console.log( ' after login')
                            return next(); 
                            
                        }
                        
                    }       
                ], function(err) {
                    if (err) {
                        req.flash('error', { title: err.message || 'Sorry, there was an issue signing you in, please try again.'});
                        return res.redirect('/signinjwt');
                    }
                });
    });
    
    view.render('session/signinjwt');

}
