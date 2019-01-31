//Keystone Generated, edit by me
var keystone = require('keystone');
var crypto = require('crypto');
var _ = require('underscore');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

//autokey is disabled for now
//what it did: generates a key for the document upon saving, based on the value of another field/path
//in this case, 'name'
var User = new keystone.List('User', {
	autokey: { path: 'key', from: 'name', unique: true }
});

User.add({
	//should I have a pre-save hook on roles to modify all affected colletions?
	name: { type: Types.Name, required: true, index: true }, //username
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	createdDate: {type: Types.Datetime, index: true, default: Date.now}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
  isVerified: { type: Boolean, label: 'Has a valid email address' }
});


/**
*   Pre-Save
*/

/*User.schema.pre('save', function(next){
	var member = this;
});*/



/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Message', path: 'messages', refPath: 'author' });

//Track when a User was last active
//surprisingly simple
User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
}


/**
* Virtuals
*/

// Get member url
/*User.schema.virtual('url').get(function() {
	return '/member/' + this.key;
});*/

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


//OTHER (possible) FUNCTIONS
//toAPI() method maybe
//static findByUsername function


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
