var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	multilingual: true,
	autokey: { path: 'slug', from: 'title', unique: true },
});




Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	comments:{type: Types.Relationship  ,ref:'PostComment', many:true},
});



Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

//Every post can have N comments

Post.relationship({ path: 'comments', ref: 'PostComment', refPath: 'post' });
///**** */
Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
